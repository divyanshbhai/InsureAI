const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = 'mongodb://127.0.0.1:27017/insurai';
        // const uri = 'your-atlas-connection-string'
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
