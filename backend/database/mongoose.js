// mongoose.js (Mongoose connection)
const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

const mongooseOptions = {
    serverSelectionTimeoutMS: 50000,  // Increase timeout
    socketTimeoutMS: 45000  // Increase socket timeout
};

mongoose.connect(uri, mongooseOptions)
  .then(() => console.log('Connected to MongoDB via Mongoose'))
  .catch(err => console.error('Error connecting to MongoDB via Mongoose:', err));

module.exports = mongoose;  // Export the Mongoose instance for schemas and models
