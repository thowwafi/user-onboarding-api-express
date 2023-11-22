const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const admin = require('firebase-admin');
const userController = require('./src/controllers/userController.js');

const app = express();
const port = process.env.PORT || 3000;

// Firebase Admin SDK Setup
const serviceAccount = require('./firebase-key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://user-onboarding-api-default-rtdb.asia-southeast1.firebasedatabase.app/',
});

// Middleware Setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({ dest: 'temp/' }).single('profilePicture'));


app.post('/api/register', userController.registerUser);
app.post('/api/login', userController.loginUser);
app.get('/api/profile', userController.getUserProfile);
app.put('/api/profile', userController.updateUserProfile);
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
