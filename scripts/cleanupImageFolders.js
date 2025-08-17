const mongoose = require('mongoose');
const fs = require('fs-extra');
const path = require('path');
require('dotenv').config();

// Import the House model
const House = require('../models/House');

// Path to the houses images directory
const housesImagesDir = path.join(__dirname, '../client/public/images/houses');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/house-sales', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('MongoDB connected successfully');
    cleanupImageFolders();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

async function cleanupImageFolders() {
  try {
    // Get all houses from the database
    const houses = await House.find({}, '_id');
    const houseIds = houses.map(house => house._id.toString());
    
    console.log(`Found ${houseIds.length} houses in the database`);
    
    // Get all folders in the houses images directory
    const folders = await fs.readdir(housesImagesDir);
    
    console.log(`Found ${folders.length} folders in the images directory`);
    
    // Identify folders to delete (those that don't correspond to a house ID and match the pattern house_X)
    const foldersToDelete = folders.filter(folder => {
      // Keep the 'default' folder
      if (folder === 'default') return false;
      
      // Keep folders that correspond to a house ID
      if (houseIds.includes(folder)) return false;
      
      // Delete folders that match the pattern house_X
      return folder.startsWith('house_');
    });
    
    console.log(`Found ${foldersToDelete.length} folders to delete: ${foldersToDelete.join(', ')}`);
    
    // Confirm deletion
    if (foldersToDelete.length === 0) {
      console.log('No folders to delete');
      mongoose.disconnect();
      return;
    }
    
    console.log('The following folders will be deleted:');
    foldersToDelete.forEach(folder => {
      console.log(`- ${folder}`);
    });
    
    // Delete the folders
    for (const folder of foldersToDelete) {
      const folderPath = path.join(housesImagesDir, folder);
      
      try {
        await fs.remove(folderPath);
        console.log(`Deleted folder: ${folder}`);
      } catch (error) {
        console.error(`Error deleting folder ${folder}:`, error);
      }
    }
    
    console.log('Cleanup completed successfully');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error during cleanup:', error);
    mongoose.disconnect();
    process.exit(1);
  }
}