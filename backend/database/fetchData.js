// fetchData.js
const {mongoose } = require('./db'); // Import the connection and mongoose

const fetchBlogs = async () => {
    const fetch_blogs = mongoose.connection.db.collection("blogs");
    return await fetch_blogs.find().toArray();
};

const fetchCategories = async () => {
    const fetch_cat = mongoose.connection.db.collection("blog_category");
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
