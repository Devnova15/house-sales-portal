const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const House = require('../models/House');

// Configure multer storage
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    // Get the house ID from the request body or query
    // If house_id is not provided, use a default folder
    const houseId = req.body.house_id || req.query.house_id || 'default';

    // Create the full path to the upload directory
    const uploadDir = path.join(__dirname, '../client/public/images/houses', houseId);

    // Create the directory if it doesn't exist
    await fs.ensureDir(uploadDir);

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Use the original filename
    cb(null, file.originalname);
  }
});

// File filter to only allow image files
const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure multer upload
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Route for uploading a single image
router.post('/image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Get the house ID from the request body or query
    const houseId = req.body.house_id || req.query.house_id || 'default';

    // Construct the path to the uploaded file (relative to the public directory)
    const filePath = `/images/houses/${houseId}/${req.file.filename}`;

    // Return the file path to be stored in the database
    res.status(200).json({ 
      message: 'File uploaded successfully',
      filePath: filePath
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
});

// Route for uploading multiple images
router.post('/images', upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // Get the house ID from the request body or query
    const houseId = req.body.house_id || req.query.house_id || 'default';

    // Construct the paths to the uploaded files
    const filePaths = req.files.map(file => `/images/houses/${houseId}/${file.filename}`);

    // Return the file paths to be stored in the database
    res.status(200).json({ 
      message: 'Files uploaded successfully',
      filePaths: filePaths
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ message: 'Error uploading files', error: error.message });
  }
});

// Route for deleting an image
router.delete('/image', async (req, res) => {
  try {
    const { house_id, filename } = req.query;

    if (!house_id || !filename) {
      return res.status(400).json({ message: 'House ID and filename are required' });
    }

    // Construct the full path to the file
    const filePath = path.join(__dirname, '../client/public/images/houses', house_id, filename);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Remove the file from the filesystem
    await fs.unlink(filePath);

    // Construct the relative path that would be stored in the database
    const relativeFilePath = `/images/houses/${house_id}/${filename}`;

    // Update the house document to remove the path from the images array
    const house = await House.findById(house_id);

    if (house) {
      // Remove the path from the images array
      house.images = house.images.filter(image => image !== relativeFilePath);

      // Save the updated house document
      await house.save();
    }

    res.status(200).json({ 
      message: 'File deleted successfully',
      filePath: relativeFilePath
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Error deleting file', error: error.message });
  }
});

module.exports = router;
