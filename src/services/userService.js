// const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const { Storage } = require('@google-cloud/storage');
const JWT_SECRET_KEY = 'your-secret-key';
const { admin } = require('../../firebase');

const storage = new Storage({
    projectId: 'user-onboarding-api',
});
const bucket = storage.bucket('user-onboarding-api.appspot.com');

// Handle file upload
async function uploadProfilePicture(file) {
    try {
      // Check if the file is present
      if (!file) {
        throw new Error('No file provided for upload.');
      }
  
      // Generate a unique filename or use the original filename
      const fileName = `${Date.now()}_${file.originalname}`;
  
      // Specify the path within the bucket where the file should be stored
      const filePath = `profile_pictures/${fileName}`;
  
      // Create a write stream to upload the file to Firebase Storage
      const fileUploadStream = bucket.file(filePath).createWriteStream();
  
      // Handle events for the file upload stream
      fileUploadStream.on('error', (err) => {
        console.error('Error during file upload:', err);
        throw err;
      });
  
      fileUploadStream.on('finish', () => {
        console.log('File upload successful.');
      });
  
      // Pipe the file buffer into the write stream
      fileUploadStream.end(file.buffer);
  
      // Get the public URL of the uploaded file
      const filePublicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
  
      return filePublicUrl;
    } catch (error) {
      console.error('Error during file upload:', error);
      throw error;
    }
}

async function isUsernameUnique(username) {
    const usersCollection = admin.firestore().collection('users');
    
    // Query the database to check if the username already exists
    const querySnapshot = await usersCollection.where('username', '==', username).get();
  
    // If there are no matching documents, the username is unique
    return querySnapshot.empty;
}

// Create a new user in the database
async function createUser(newUser) {
  const usersCollection = admin.firestore().collection('users');
  const userDocRef = await usersCollection.add(newUser);
  return userDocRef;
}


async function authenticateUser(username, password) {
    const usersCollection = admin.firestore().collection('users');
    const querySnapshot = await usersCollection.where('username', '==', username).where('password', '==', password).get();
  
    if (querySnapshot.empty) {
      return null; // User not found or password incorrect
    }
  
    // Assuming that username and password are unique, return the first user found
    return querySnapshot.docs[0].data();
}

function generateAccessToken(user) {
    const payload = {
      userId: user.userId, // Replace with the actual user ID field from your database
      username: user.username,
    };
  
    const options = {
      expiresIn: '1h', // Token expiration time
    };
  
    return jwt.sign(payload, JWT_SECRET_KEY, options);
}

function getUserProfileByToken(token) {
    try {
      const decodedToken = jwt.verify(token, JWT_SECRET_KEY);
      const username = decodedToken.username; // Assuming the user ID is included in the token payload
  
      return getUserProfileByUsername(username);
    } catch (error) {
      // Token is invalid or expired
      return null;
    }
}

async function getUserProfileByUsername(username) {
    if (!username || typeof username !== 'string') {
      return null; // Invalid user ID
    }
  
    const usersCollection = admin.firestore().collection('users');
    const querySnapshot = await usersCollection.where('username', '==', username).get();
    const userDoc = querySnapshot.docs[0];
    if (!userDoc.exists) {
      return null; // User not found
    }
  
    return userDoc.data();
}

async function updateUserProfile(username, updatedProfile) {
    if (!username || typeof username !== 'string') {
      return null; // Invalid user ID
    }
  
    const usersCollection = admin.firestore().collection('users');
    const querySnapshot = await usersCollection.where('username', '==', username).get();
    const userDocRef = querySnapshot.docs[0].ref;
    
    const sanitizedProfile = sanitizeObject(updatedProfile);
    await userDocRef.update(sanitizedProfile);
  
    // Retrieve and return the updated user profile
    const updatedUserDoc = await userDocRef.get();
    return updatedUserDoc.data();
}

function sanitizeObject(obj) {
    const sanitizedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] !== undefined) {
        sanitizedObj[key] = obj[key];
      }
    }
    return sanitizedObj;
}

module.exports = {
  isUsernameUnique,
  uploadProfilePicture,
  createUser,
  authenticateUser,
  generateAccessToken,
  getUserProfileByToken,
  getUserProfileByUsername,
  updateUserProfile
};
