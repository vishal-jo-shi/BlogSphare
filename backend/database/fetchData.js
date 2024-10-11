// fetchData.js
const { mongoDB, mongoose } = require('./db'); // Import the connection and mongoose

const fetchBlogs = async () => {
    await mongoDB(); // Ensure the connection is established
    const db = mongoose.connection.db;
        
        if (!db) {
            throw new Error('Database connection not established');
        }

    const fetch_blogs = db.collection("blogs");
    return await fetch_blogs.find().toArray();
};

const fetchCategories = async () => {
    await mongoDB(); // Ensure the connection is established
    const db = mongoose.connection.db;
        
        if (!db) {
            throw new Error('Database connection not established');
        }

    const fetch_cat = db.collection("blog_category");
    return await fetch_cat.find().toArray();
};

const fetchData = async () => {
    const blogs = await fetchBlogs();
    const categories = await fetchCategories();
    return { blogs, categories };
};

// Export the fetch functions
module.exports = {
    fetchBlogs,
    fetchCategories,
    fetchData
};
