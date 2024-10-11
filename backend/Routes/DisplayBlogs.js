const express = require('express')
const router = express.Router()
const Blogs = require('../models/Blogs');
const mongoDB = require('../database/db');
const Profile = require('../models/Profile');
const Comments = require('../models/Comments')
const fs = require('fs');
const path = require('path');
router.post('/blogdata',(req,res)=>{
    try {
        mongoDB();
        res.send([global.blogs,global.blogsCat]);
    } catch (error) {
        console.error(error.message);
        res.send("Server Error")
    }
})
router.post('/myblogs', async (req, res) => {
  try {
    mongoDB();
    const blogs = global.blogs.filter(blog => blog.email === req.body.email);
    res.json([blogs, global.blogsCat]);
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error.message })
  }
});


router.post('/createblog',async(req,res)=>{
  try {
    // Extract the data from the request body
    const { title, categoryName, desc, img, contents, email, createdAt, updatedAt } = req.body;

    // Create a new blog instance using the data
    const newBlog = new Blogs({
      title,
      categoryName,
      desc,
      img,
      contents,
      email,
      createdAt,
      updatedAt
    });
    const savedBlog = await newBlog.save();
    
    // Assuming you have a User model and the user's email is passed in the request
    const profile = await Profile.findOne({ email }); // or use user's ID if you have it

    if (profile) {
      // Add the new blogId to the user's blog array
      profile.blogs.push(savedBlog._id); // Assuming the user's blog array is named 'blogs'
      await profile.save(); // Save the updated user document
    }

    // Send a success response
    res.status(200).json({ message: 'Blog created successfully', blog: savedBlog });
  } catch (error) {
    // Handle errors during saving to the database
    console.error('Error creating blog:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/updateblog', async (req, res) => {
  try {
    const { id, data } = req.body;
    const { title, categoryName, desc, img, contents, email } = data;

    // Find the existing blog to retrieve old images
    const existingBlog = await Blogs.findById(id);

    if (!existingBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Delete old main image if it exists and is different
    if (existingBlog.img && existingBlog.img !== img) {
      const oldImgPath = path.join(__dirname, '../uploads', email, existingBlog.img.split('/').pop());
      fs.unlink(oldImgPath, (err) => {
        if (err) {
          console.error('Error deleting old image:', err);
        }
      });
    }

    // Delete old images from contents if they exist and are different
    if (existingBlog.contents) {
      for (let i = 0; i < existingBlog.contents.length; i++) {
        const oldContentImg = existingBlog.contents[i].img;
        const newContentImg = contents[i]?.img; // Use optional chaining to handle undefined

        if (oldContentImg && oldContentImg !== newContentImg) {
          const oldContentImgPath = path.join(__dirname, '../uploads', email, oldContentImg.split('/').pop());
          fs.unlink(oldContentImgPath, (err) => {
            if (err) {
              console.error('Error deleting old content image:', err);
            }
          });
        }
      }
    }

    // Update the blog with new data
    const updatedBlog = await Blogs.findByIdAndUpdate(
      id,
      {
        title,
        categoryName,
        desc,
        img,
        contents,
        email,
        updatedAt: new Date(), // Update the timestamp
      },
      { new: true } // Return the updated document
    );

    // Update the user's profile if needed
    const profile = await Profile.findOne({ email });
    if (profile && !profile.blogs.includes(updatedBlog._id)) {
      profile.blogs.push(updatedBlog._id);
      await profile.save();
    }

    res.status(200).json({ message: 'Blog updated successfully', blog: updatedBlog });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



router.post('/deleteblog', async (req, res) => {
  try {
    // Find the blog to get its details
    const blogToDelete = await Blogs.findById(req.body.id);

    if (!blogToDelete) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Delete the blog by its ID
    const deletedBlog = await Blogs.findByIdAndDelete(req.body.id);

    // Delete comments associated with the deleted blog
    await Comments.deleteMany({ blogId: req.body.id });

    // Construct the image file paths
    const emailFolder = blogToDelete.email; // Assuming you have the email in the blog document
    const mainImagePath = path.join(__dirname, '../uploads', emailFolder, blogToDelete.img.split('/').pop());
    const contentImages = blogToDelete.contents.map(content => content.img);

    // Delete the main image file
    fs.unlink(mainImagePath, (err) => {
      if (err) {
        console.error('Error deleting main image:', err);
      }
    });
    // Delete content images
    contentImages.forEach(image => {
      const contentImagePath = path.join(__dirname, '../uploads', emailFolder, image.split('/').pop());
      fs.unlink(contentImagePath, (err) => {
        if (err) {
          console.error('Error deleting content image:', err);
        }
      });
    });
    const profile = await Profile.findOne({ email: blogToDelete.email });
    if (profile) {
      profile.blogs = profile.blogs.filter(blogId => blogId.toString() !== req.body.id);
      await profile.save();
    }
    res.status(200).json({ message: 'Blog, related comments, and images deleted successfully', blog: deletedBlog });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;
