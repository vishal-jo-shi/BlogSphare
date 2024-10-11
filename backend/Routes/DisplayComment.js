const express = require('express')
const router = express.Router()
const Comments = require('../models/Comments');
const mongoDB = require('../database/db')

router.post('/commentdata', async (req, res) => {
    try {
        mongoDB(); // Connect to your database
        const blogId  = req.body.id; // Get the blog ID from the request body
        if (!blogId) {
            return res.status(400).json({ message: "Blog ID is required" }); // Handle missing Blog ID
        }
        // Find all comments with the same blogId
        const comments = await Comments.find({ blogId: blogId });
        res.json(comments); // Send the comments back as a response
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

router.post('/addcomment',async(req,res)=>{
    try {
        // Extract the data from the request body
        const { blogId, content,email, username,createdAt, updatedAt } = req.body;
        // Create a new cmt instance using the data
      
        const newComment = new Comments({
            blogId, 
            content,
            email,
            username,
            createdAt,
            updatedAt
        });
        // Save the new cmt to the database
        const savedComment = await newComment.save();
        // Send a success response

        res.status(200).json({ message: 'Comment created successfully', blog: savedComment });
      } catch (error) {
        // Handle errors during saving to the database
        console.error('Error creating Comment:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
})

router.post('/updatecomment', async (req, res) => {
  try {

    const { id, data } = req.body; // Expecting 'id' and 'data' in the body
    if (!id || !data) {
        return res.status(400).json({ message: "Invalid request. 'id' and 'data' are required." });
    }
    const { blogId, content, email, username,createdAt, updatedAt } = data; // Destructure data

    // Update the comment by its ID
    const updatedComment = await Comments.findByIdAndUpdate(
        id,
        {
            blogId, 
            content,
            email,
            username,
            createdAt,
            updatedAt
        },
        { new: true } // Return the updated comment
    );

    // Check if the comment was found and updated
    if (updatedComment) {
        res.status(200).json({ message: 'Comment updated successfully', comment: updatedComment });
    } else {
        res.status(404).json({ message: 'Comment not found' });
    }
} catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Internal server error' });
}
  });
  
  router.post('/deletecomment', async (req, res) => {
    try {
      // Delete the cmt by its ID
      const commentId = req.body.id;

      const deletedcomment = await Comments.findByIdAndDelete(commentId);
      if(deletedcomment){
        console.log("deleted comment",deletedcomment)
      }
      if (deletedcomment) {
        res.status(200).json({ message: 'Comment deleted successfully', comment: deletedcomment });
      } else {
        res.status(404).json({ message: 'Comment not found' });
      }
    } catch (error) {
      console.error('Error deleting Comment:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = router;
