const admin = require('firebase-admin');
const serviceAccount = require('./task-management-f903b-firebase-adminsdk-azl3s-1191874f9f.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
