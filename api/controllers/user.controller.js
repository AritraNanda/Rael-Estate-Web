import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import Seller from '../models/seller.model.js'
import { errorHandler } from '../utils/error.js';
import Listing from '../models/listing.model.js'
import SavedProperty from '../models/savedProperty.model.js';

export const test = (req, res) => {
  res.json({
    message: 'Api route is working!',
  });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only update your own account!'));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
 
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};


export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only delete your own account!'));
  try {
    // Delete all saved properties associated with this user
    await SavedProperty.deleteMany({ userRef: req.params.id });
    
    // Delete the user
    await User.findByIdAndDelete(req.params.id);
    
    res.clearCookie('access_token');
    res.status(200).json('User has been deleted!');
  } catch (error) {
    next(error);
  }
};











export const updateUser2 = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only update your own account!'));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
 
    const updatedUser2 = await Seller.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    

    const { password, ...rest } = updatedUser2._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};


export const deleteUser2 = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only delete your own account!'));
  try {
    await Seller.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token2');
    res.status(200).json('User has been deleted!').clearCookie('access_token2');
  } catch (error) {
    next(error);
  }
};



export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, 'You can only view your own listings!'));
  }
};


export const getUser = async (req, res, next) => {
  try {
    
    const user = await Seller.findById(req.params.id);
  
    if (!user) return next(errorHandler(404, 'User not found!'));
  
    const { password: pass, ...rest } = user._doc;
  
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Add the findUserByEmail controller function
export const findUserByEmail = async (req, res, next) => {
  try {
    const email = req.query.email;
    
    if (!email) {
      return next(errorHandler(400, 'Email parameter is required'));
    }
    
    const user = await Seller.findOne({ email }).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found with this email'
      });
    }
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};
