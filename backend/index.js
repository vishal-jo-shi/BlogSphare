const express = require('express');
const mongoDB = require('./database/db');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const client = new MongoClient(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 20000, // Increase timeout to 20 seconds
});

// Middleware for CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", `${process.env.FRONTEND_URL}`);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static('uploads'));

// Connect to MongoDB once and store the database reference
const initDB = async () => {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err.message);
    }
};

// Endpoint to fetch data from MongoDB
app.get('/', async (req, res) => {
    try {
        const db = client.db('mydatabase'); // Specify your database name here
        const blogsCollection = db.collection("blogs");
        const blogsCatCollection = db.collection("blog_category");
        const commentsCollection = db.collection("comments");

        const [blogs, blogsCat, blogsCmt] = await Promise.all([
            blogsCollection.find().toArray(),
            blogsCatCollection.find().toArray(),
            commentsCollection.find().toArray()
        ]);

        res.status(200).json({ blog: blogs, category: blogsCat, comment: blogsCmt });
    } catch (err) {
        console.error('Connection or collection access failed:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Initialize the database connection
initDB();

// Use your defined routes
app.use('/api', require("./Routes/CreateUser"));
app.use('/api', require("./Routes/DisplayBlogs"));
app.use('/api', require("./Routes/DisplayComment"));
app.use('/api', require("./Routes/DisplayProfiles"));
app.use('/api', require("./middleware/uploads"));

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`);
});
