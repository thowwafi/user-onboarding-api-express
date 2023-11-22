const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
// const admin = require('firebase-admin');
const userController = require('./src/controllers/userController.js');
const { admin } = require('./firebase');
const app = express();
const port = process.env.PORT || 3000;

// Middleware Setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(multer({ dest: 'temp/' }).single('profilePicture'));
const upload = multer({ dest: 'temp/' });


app.post('/api/register', userController.registerUser);
app.post('/api/login', userController.loginUser);
app.get('/api/profile', userController.getUserProfile);
app.put('/api/profile', upload.single('profilePicture'), userController.updateUserProfile);

const setupServer = () => {
  const port = process.env.PORT || 3000;
  return app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};
if (!module.parent) {
  setupServer()
}
module.exports = {app, setupServer, admin};