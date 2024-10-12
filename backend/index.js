const express = require('express');
require('dotenv').config();
// const  clientPromise = require ('./database/db');
const app = express();

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


// Endpoint to fetch data from MongoDB
// app.get('/', async (req, res) => {
//     try {
//       const mongoClient =  await clientPromise;
//         const db = mongoClient.db('mydatabase'); // Specify your database name here
//         const blogsCollection = db.collection("blogs");
//         const blogsCatCollection = db.collection("blog_category");
//         const commentsCollection = db.collection("comments");

//         const [blogs, blogsCat, blogsCmt] = await Promise.all([
//             blogsCollection.find().toArray(),
//             blogsCatCollection.find().toArray(),
//             commentsCollection.find().toArray()
//         ]);

//         res.status(200).json({ blog: blogs, category: blogsCat, comment: blogsCmt });
//     } catch (err) {
//         console.error('Connection or collection access failed:', err.message);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

app.get('/', async (req, res) => {
  res.send("Hello World")
})


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
