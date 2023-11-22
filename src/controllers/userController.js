// src/controllers/userController.js
const admin = require('firebase-admin');
const validationUtils = require('../utils/validationUtils');
const userService = require('../services/userService');

// Endpoint to register a new user
async function registerUser(req, res) {
  try {
    // Validate request data
    const { username, password, profileName } = req.body;
    if (
      !validationUtils.isValidString(username) ||
      !validationUtils.isValidString(password) ||
      !validationUtils.isValidString(profileName)
    ) {
      return res.status(400).json({ error: 'Username, password, and profile name are required.' });
    }

    // Check if the username is unique
    const isUsernameUnique = await userService.isUsernameUnique(username);
    if (!isUsernameUnique) {
      return res.status(400).json({ error: 'Username is already taken.' });
    }

    // Handle file upload
    const profilePictureUrl = req.file ? await userService.uploadProfilePicture(req.file) : undefined;


    // Create a new user in the database
    const newUser = {
      profileName,
      username,
      password, // Note: In a production environment, you should handle password hashing and security.
      ...(profilePictureUrl && { profilePictureUrl }),
    };

    const userDocRef = await userService.createUser(newUser);

    return res.status(201).json({
      message: 'User registered successfully.',
      userId: userDocRef.id,
    });
  } catch (error) {
    console.error('Error during user registration:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function loginUser(req, res) {
    try {
      // Validate request data
      const { username, password } = req.body;
      if (!validationUtils.isValidString(username) || !validationUtils.isValidString(password)) {
        return res.status(400).json({ error: 'Username and password are required.' });
      }
  
      // Authenticate the user
      const authenticatedUser = await userService.authenticateUser(username, password);
  
      if (!authenticatedUser) {
        return res.status(401).json({ error: 'Authentication failed. Invalid username or password.' });
      }

      const accessToken = userService.generateAccessToken(authenticatedUser);  

        return res.status(200).json({
            message: 'Login successful.',
            user: authenticatedUser,
            accessToken,
        });
    } catch (error) {
      console.error('Error during user login:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
}

async function getUserProfile(req, res) {
    try {
      const accessToken = req.headers.authorization?.replace('Bearer ', ''); // Assuming the token is sent in the Authorization header
  
      if (!accessToken) {
        return res.status(401).json({ error: 'Authentication token is missing.' });
      }
  
      const userProfile = await userService.getUserProfileByToken(accessToken);
  
      if (!userProfile) {
        return res.status(401).json({ error: 'Invalid or expired token. Please log in again.' });
      }
  
      return res.status(200).json({
        message: 'User profile retrieved successfully.',
        userProfile,
      });
    } catch (error) {
      console.error('Error during user profile retrieval:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
}

async function  updateUserProfile(req, res) {
    try {
      const accessToken = req.headers.authorization?.replace('Bearer ', ''); // Assuming the token is sent in the Authorization header
  
      if (!accessToken) {
        return res.status(401).json({ error: 'Authentication token is missing.' });
      }
  
      const userProfile = await userService.getUserProfileByToken(accessToken);
  
      if (!userProfile) {
        return res.status(401).json({ error: 'Invalid or expired token. Please log in again.' });
      }
  
      // Validate and update user profile
      const { profileName } = req.body;
      const updatedProfile = { profileName };
  
      // Optional: Handle file upload and update profile picture
      if (req.file) {
        const profilePictureUrl = await userService.uploadProfilePicture(req.file);
        updatedProfile.profilePictureUrl = profilePictureUrl;
      }
  
      const updatedUserProfile = await userService.updateUserProfile(userProfile.username, updatedProfile);
  
      return res.status(200).json({
        message: 'User profile updated successfully.',
        userProfile: updatedUserProfile,
      });
    } catch (error) {
      console.error('Error during user profile update:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
}
  
module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
};
