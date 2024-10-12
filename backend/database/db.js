const { MongoClient } = require('mongodb');
require('dotenv').config();

const mongoDB = async () => {
    const client = new MongoClient(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 20000 // Increase timeout to 20 seconds
    });

    try {
        // Connect to MongoDB
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        // Log the custom error messages
        console.error('Connection or collection access failed:', error.message);
        // You can also log the full error object if needed
        console.error(error);
    } finally {
        // Ensure the client is closed
        await client.close();
    }
};

module.exports = mongoDB;
