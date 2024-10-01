// config/db.js
const mongoose = require('mongoose');
require('dotenv').config();
console.log('MongoDB URI:', process.env.MONGO_URI);
const connectDB = async () => {
    const uri = process.env.MONGO_URI; // Retrieve MongoDB URI from environment variables
    if (!uri) {

        throw new Error('MONGO_URI is not defined in environment variables');
    }

    try {
        console.log('MongoDB URI:', process.env.MONGO_URI);

        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
