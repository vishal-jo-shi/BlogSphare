const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: (req) => req.body.email,
    format: async (req, file) => file.mimetype.split('/')[1],
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
    quality: 'auto', // Automatically adjust quality based on the image
  },
});

// Create multer instance with Cloudinary storage configuration
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Set max file size to 10MB
});

// Define the upload route
router.post('/upload', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      // Check for specific multer error codes
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size exceeds limit of 10MB' });
      }
      // Handle other multer errors
      return res.status(500).json({ error: 'File upload failed due to server error' });
    }
    
    // If no file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'File upload failed: No file provided' });
    }
    
    // Successful upload response
    res.status(200).json({
      message: 'File uploaded successfully',
      filename: req.file.filename, // Cloudinary file name
      path: req.file.path, // Cloudinary URL to access the image
    });
  });
});

module.exports = router;
