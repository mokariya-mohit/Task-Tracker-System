const admin = require('firebase-admin');

const sendPushNotification = async ({ title, body, userId }) => {
    try {
        // Retrieve the user's device token from your database
        const user = await User.findById(userId); // Assuming you have a User model
        const registrationToken = user.deviceToken; // The token you saved for this user

        if (registrationToken) {
            const message = {
                notification: {
                    title,
                    body
                },
                token: registrationToken
            };

            await admin.messaging().send(message);
            console.log('Notification sent successfully');
        } else {
            console.log('No device token found for user');
        }
    } catch (error) {
        console.error('Error sending push notification:', error);
    }
};

module.exports = { sendPushNotification };
