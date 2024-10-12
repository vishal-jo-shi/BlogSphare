const mongoose = require('mongoose');
require('dotenv').config();

const mongoDB = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URL, {
            serverSelectionTimeoutMS: 20000 // Increase timeout to 20 seconds
        });
        console.log('Connected to MongoDB');

        // Ensure connection is established
        if (mongoose.connection.readyState !== 1) {
            throw new Error('MongoDB connection is not established');
        }

        // Attempt to fetch collections
        const blogsCollection = mongoose.connection.db.collection("blogs");
        const blogsCatCollection = mongoose.connection.db.collection("blog_category");
        const commentsCollection = mongoose.connection.db.collection("comments");

        // Check if collections are available
        if (!blogsCollection) {
            throw new Error('Blogs collection is not available');
        }
        if (!blogsCatCollection) {
            throw new Error('Blog category collection is not available');
        }
        if (!commentsCollection) {
            throw new Error('Comments collection is not available');
        }

        // Fetch data concurrently and store in global variables
        const [blogs, blogsCat, blogsCmt] = await Promise.all([
            blogsCollection.find().toArray(),
            blogsCatCollection.find().toArray(),
            commentsCollection.find().toArray()
        ]);

        global.blogs = blogs;
        global.blogsCat = blogsCat;
        global.blogsCmt = blogsCmt;

    } catch (error) {
        // Log the custom error messages
        console.error('Connection or collection access failed:', error.message);
        // You can also log the full error object if needed
        console.error(error);
    }
};

module.exports = mongoDB;
