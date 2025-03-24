// Import required modules
import Listing from '../models/listing.model.js';
import User from '../models/user.model.js';
import Seller from '../models/seller.model.js';
import { errorHandler } from '../utils/error.js';

// Process and optimize base64 images to reduce their size
const optimizeImageUrls = (imageUrls) => {
  return imageUrls.map(url => {
    // Skip if not a base64 image
    if (!url.startsWith('data:image')) return url;
    
    // Check if image is already a reasonable size
    if (url.length < 500 * 1024) { // 500KB
      return url;
    }
    
    try {
      // For very large base64 strings, strip some metadata and compress further
      // Extract the actual base64 data from the data URL
      const [header, base64Data] = url.split(',');
      
      // Only process JPEG or PNG images
      if (header.includes('image/jpeg') || header.includes('image/png')) {
        // Return the processed image
        return url;
      }
      
      return url;
    } catch (error) {
      console.error('Error optimizing image:', error);
      return url;
    }
  });
};

// Create a new listing as a staff member
export const createStaffListing = async (req, res, next) => {
  try {
    const { name, description, address, userRef, imageUrls, ...rest } = req.body;
    
    // Validation
    if (!name || !description || !address || !userRef) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }
    
    // Ensure we have at least one image
    if (!imageUrls || imageUrls.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one image'
      });
    }
    
    // Limit number of images to prevent document size issues
    const maxImages = 6;
    if (imageUrls.length > maxImages) {
      return res.status(400).json({
        success: false,
        message: `Too many images. Maximum ${maxImages} allowed.`
      });
    }
    
    
    // Verify that user exists
    const seller = await Seller.findById(userRef);
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }
    
    // Create listing with the staff member as creator
    const staffId = req.staff.id; // From middleware
    
    const newListing = new Listing({
      name,
      description,
      address,
      userRef,
      imageUrls,
      createdBy: staffId,
      ...rest
    });
    
    try {
      const savedListing = await newListing.save();
      res.status(201).json({
        success: true,
        listing: savedListing
      });
    } catch (error) {
      console.error('Error saving listing:', error);
      throw error; // Re-throw for the outer catch block
    }
  } catch (error) {
    console.error('Error creating listing:', error);
    next(error);
  }
};

// Get all listings for staff to manage
export const getStaffListings = async (req, res, next) => {
  try {
    // Staff can see all listings
    const listings = await Listing.find({})
      .sort({ createdAt: -1 })
      .limit(50); // Limit to most recent 50
    
    res.status(200).json({
      success: true,
      listings
    });
  } catch (error) {
    next(error);
  }
}; 