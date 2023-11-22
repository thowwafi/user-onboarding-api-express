const admin = require('firebase-admin');
const serviceAccount = require('./firebase-key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://user-onboarding-api-default-rtdb.asia-southeast1.firebasedatabase.app/',
});

module.exports = { admin };