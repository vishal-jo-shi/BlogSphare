const mongoose = require('mongoose');
require('dotenv').config();
const mongoDB = async () => {
    try {
         await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB')
        const fetch_blogs = mongoose.connection.db.collection("blogs")
        global.blogs=await fetch_blogs.find().toArray();
        const fetch_cat = mongoose.connection.db.collection("blog_category");
        global.blogsCat=await fetch_cat.find().toArray();
        const fetch_cmt = mongoose.connection.db.collection("comments");
        global.blogsCmt=await fetch_cmt.find().toArray();
    } catch (error) {
        console.log('Connection failed', error)
    }
};

module.exports = mongoDB;
