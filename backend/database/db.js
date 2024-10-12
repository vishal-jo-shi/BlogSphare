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

        // Access the database
        const db = client.db('mydatabase'); // Specify your database name here

        // Access collections
        const blogsCollection = db.collection("blogs");
        const blogsCatCollection = db.collection("blog_category");
        const commentsCollection = db.collection("comments");

        // Fetch data concurrently and store in global variables
        const [blogs, blogsCat, blogsCmt] = await Promise.all([
            blogsCollection.find().toArray(),
            blogsCatCollection.find().toArray(),
            commentsCollection.find().toArray()
        ]);

        global.blogs = blogs;
        global.blogsCat = blogsCat;
        global.blogsCmt = blogsCmt;

        // Handle case where collections might be empty
        if (blogs.length === 0) {
            console.log('No blogs found');
        }
        if (blogsCat.length === 0) {
            console.log('No blog categories found');
        }
        if (blogsCmt.length === 0) {
            console.log('No comments found');
        }
        

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
