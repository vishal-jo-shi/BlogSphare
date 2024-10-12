const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const options = {
    serverSelectionTimeoutMS:  50000, // Increase the timeout to 50 seconds
    socketTimeoutMS:  50000, // Increase the socket timeout to 50 seconds
};

let client;
let clientPromise;

if (!uri) {
    throw new Error('Please add your Mongo URI to .env');
}

if (process.env.NODE_ENV === 'development') {
    // Check if there's already a client promise for reuse
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // For production, create a new client and connect
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

// Log successful connection
clientPromise.then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("MongoDB connection error:", err);
});

module.exports = clientPromise;
