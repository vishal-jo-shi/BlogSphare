const express = require('express');
const router = express.Router();
const Blogs = require('../models/Blogs');
const Profile = require('../models/Profile');
const Comments = require('../models/Comments');
const cloudinary = require('cloudinary').v2;
const clientPromise = require('../database/db');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Fetch blog and category data
router.post('/blogdata', async (req, res) => {
    try {
        const mongoClient = await clientPromise;
        const db = mongoClient.db('mydatabase');
        const blogsCollection = db.collection("blogs");
        const blogsCatCollection = db.collection("blog_category");

        const [blogs, blogsCat] = await Promise.all([
            blogsCollection.find().toArray(),
            blogsCatCollection.find().toArray()
        ]);
        res.json([blogs, blogsCat]);
    } catch (error) {
        console.error(error.message);
        res.json("Server Error");
    }
});

// Fetch user's blogs
router.post('/myblogs', async (req, res) => {
    try {
        const mongoClient = await clientPromise;
        const db = mongoClient.db('mydatabase');
        const blogsCollection = db.collection("blogs");
        const blogsCatCollection = db.collection("blog_category");

        const [blogs, blogsCat] = await Promise.all([
            blogsCollection.find().toArray(),
            blogsCatCollection.find().toArray()
        ]);

        const userBlogs = blogs.filter(blog => blog.email === req.body.email);
        res.json([userBlogs, blogsCat]);
    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
});

// Create a new blog
router.post('/createblog', async (req, res) => {
    try {
        const { title, categoryName, desc, img, contents, email, createdAt, updatedAt } = req.body;

        // Upload image to Cloudinary
        const uploadedImage = await cloudinary.uploader.upload(img, { folder: "blogs" });
        
        const newBlog = new Blogs({
            title,
            categoryName,
            desc,
            img: uploadedImage.secure_url, // Save Cloudinary URL
            contents,
            email,
            createdAt,
            updatedAt
        });

        const savedBlog = await newBlog.save();

        const profile = await Profile.findOne({ email });
        if (profile) {
            profile.blogs.push(savedBlog._id);
            await profile.save();
        }

        res.status(200).json({ message: 'Blog created successfully', blog: savedBlog });
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update a blog
router.post('/updateblog', async (req, res) => {
    try {
        const { id, data } = req.body;
        const { title, categoryName, desc, img, contents, email } = data;

        const existingBlog = await Blogs.findById(id);
        if (!existingBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Handle image updates
        if (existingBlog.img && existingBlog.img !== img) {
            // Delete old image from Cloudinary
            const publicId = existingBlog.img.split('/').pop().split('.')[0]; // Assuming img URL format
            await cloudinary.uploader.destroy(`blogs/${publicId}`);
            
            // Upload new image to Cloudinary
            const uploadedImage = await cloudinary.uploader.upload(img, { folder: "blogs" });
            img = uploadedImage.secure_url; // Update img to the new URL
        }

        // Update blog
        const updatedBlog = await Blogs.findByIdAndUpdate(
            id,
            {
                title,
                categoryName,
                desc,
                img,
                contents,
                email,
                updatedAt: new Date(),
            },
            { new: true }
        );

        res.status(200).json({ message: 'Blog updated successfully', blog: updatedBlog });
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete a blog
router.post('/deleteblog', async (req, res) => {
    try {
        const blogToDelete = await Blogs.findById(req.body.id);
        if (!blogToDelete) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        await Blogs.findByIdAndDelete(req.body.id);
        await Comments.deleteMany({ blogId: req.body.id });

        // Delete main image from Cloudinary
        const publicId = blogToDelete.img.split('/').pop().split('.')[0]; // Assuming img URL format
        await cloudinary.uploader.destroy(`blogs/${publicId}`);

        // Delete content images from Cloudinary
        await Promise.all(blogToDelete.contents.map(async (content) => {
            const contentPublicId = content.img.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`blogs/${contentPublicId}`);
        }));

        const profile = await Profile.findOne({ email: blogToDelete.email });
        if (profile) {
            profile.blogs = profile.blogs.filter(blogId => blogId.toString() !== req.body.id);
            await profile.save();
        }

        res.status(200).json({ message: 'Blog, related comments, and images deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
