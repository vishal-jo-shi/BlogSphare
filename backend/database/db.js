const mongoose = require('mongoose');
require('dotenv').config();

const mongoDB = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URL, {
            serverSelectionTimeoutMS: 20000 // Increase timeout to 20 seconds
        });
        console.log('Connected to MongoDB');

        // Fetching data concurrently
        const [blogs, blogsCat, blogsCmt] = await Promise.all([
            mongoose.connection.db.collection("blogs").find().toArray(),
            mongoose.connection.db.collection("blog_category").find().toArray(),
            mongoose.connection.db.collection("comments").find().toArray()
        ]);

        global.blogs = blogs;
        global.blogsCat = blogsCat;
        global.blogsCmt = blogsCmt;

    } catch (error) {
        console.log('Connection failed', error);
    }
};

module.exports = mongoDB;
