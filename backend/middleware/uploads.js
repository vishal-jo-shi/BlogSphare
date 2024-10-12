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
    folder: (req) => req.body.email, // Dynamically create folder using user's email
    format: async (req, file) => 'png', // Optional: convert all files to PNG
    public_id: (req, file) => `${Date.now()}-${file.originalname}`, // Create unique file name
  },
  
});

// Create multer instance with Cloudinary storage configuration
const upload = multer({ storage });

router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'File upload failed' });
  }
  
  res.status(200).json({
    message: 'File uploaded successfully',
    filename: req.file.filename, // Cloudinary file name
    path: req.file.path, // Cloudinary URL to access the image
  });
});

module.exports = router;
