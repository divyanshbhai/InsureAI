// index.js
const connectDB = require('./db'); // Import the DB connection
require('./whatsapp.js'); // Initialize WhatsApp integration

// Connect to MongoDB
connectDB();
