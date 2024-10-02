// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    mobileNo: { type: String, required: true, unique: true },
    chatId: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);
