const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define the upload path, dynamically creating folder using email
    const uploadPath = path.join(__dirname, '../uploads', req.body.email);
    // Check if the directory exists, if not, create it
    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      if (err) {
        console.error("Directory creation failed:", err);
        return cb(err); // Pass the error to the callback
      }
      cb(null, uploadPath); // Store the file in the newly created folder
    });
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

// Create multer instance with storage configuration
const upload = multer({ storage });

router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
      return res.status(400).json({ error: 'File upload failed' });
  }
  const fileUrl = `${req.protocol}://${req.get('host')}/images/${req.body.email}/${req.file.filename}`;
  
  res.status(200).json({
      message: 'File uploaded successfully',
      filename: req.file.filename,
      path: fileUrl,
  });
});

module.exports = router;
