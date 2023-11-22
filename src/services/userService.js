const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = 'your-secret-key';

// Check if the username is unique
async function isUsernameUnique(username) {
    const usersCollection = admin.firestore().collection('users');
    
    // Query the database to check if the username already exists
    const querySnapshot = await usersCollection.where('username', '==', username).get();
  
    // If there are no matching documents, the username is unique
    return querySnapshot.empty;
}

// Handle file upload
async function uploadProfilePicture(file) {
  // Implementation goes here...
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
      const userId = decodedToken.userId; // Assuming the user ID is included in the token payload
  
      return getUserProfileById(userId);
    } catch (error) {
      // Token is invalid or expired
      return null;
    }
}

async function getUserProfileById(userId) {
    if (!userId || typeof userId !== 'string') {
      return null; // Invalid user ID
    }
  
    const usersCollection = admin.firestore().collection('users');
    const userDoc = await usersCollection.doc(userId).get();
  
    if (!userDoc.exists) {
      return null; // User not found
    }
  
    return userDoc.data();
}

async function updateUserProfile(userId, updatedProfile) {
    if (!userId || typeof userId !== 'string') {
      return null; // Invalid user ID
    }
  
    const usersCollection = admin.firestore().collection('users');
    const userDocRef = usersCollection.doc(userId);
  
    await userDocRef.update(updatedProfile);
  
    // Retrieve and return the updated user profile
    const updatedUserDoc = await userDocRef.get();
    return updatedUserDoc.data();
}

module.exports = {
  isUsernameUnique,
  uploadProfilePicture,
  createUser,
  authenticateUser,
  generateAccessToken,
  getUserProfileByToken,
  getUserProfileById,
  updateUserProfile
};
