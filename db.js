// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Replace the connection string with your own
        const uri = 'mongodb://127.0.0.1:27017/insurai'; // For local MongoDB
        // const uri = 'your-atlas-connection-string'; // For MongoDB Atlas
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
