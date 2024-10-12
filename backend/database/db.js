const mongoose = require('mongoose');
require('dotenv').config();

const mongoDB = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('Connected to MongoDB');

        // Fetching collections
        const fetch_blogs = mongoose.connection.collection("blogs");
        const fetch_cat = mongoose.connection.collection("blog_category");
        const fetch_cmt = mongoose.connection.collection("comments");

        // Use Promise.all to fetch all data concurrently
        [global.blogs, global.blogsCat, global.blogsCmt] = await Promise.all([
            fetch_blogs.find().toArray(),
            fetch_cat.find().toArray(),
            fetch_cmt.find().toArray(),
        ]);

        console.log('Fetched blogs, categories, and comments successfully');
    } catch (error) {
        console.log('Connection failed', error);
    }
};

module.exports = mongoDB;
