// db.js
const mongoose = require('mongoose');

let isConnected; // Variable to track connection status

const mongoDB = async () => {
    if (isConnected) {
        return; // Return if already connected
    }
    
    try {
        await mongoose.connect(process.env.MONGO_URL);
        isConnected = true; // Update connection status
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Connection failed', error);
        throw error; // Throw error to handle it in the calling function
    }
};

module.exports = { mongoDB, mongoose };
