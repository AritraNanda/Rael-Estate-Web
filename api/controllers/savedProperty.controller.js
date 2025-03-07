import SavedProperty from '../models/savedProperty.model.js';
import { errorHandler } from '../utils/error.js';

export const saveProperty = async (req, res, next) => {
  try {
    const { listingId } = req.body;
    const userId = req.user.id;

    const savedProperty = await SavedProperty.create({
      userRef: userId,
      listingRef: listingId
    });

    res.status(201).json({
      success: true,
      message: 'Property saved successfully',
      savedProperty
    });
  } catch (error) {
    // If error is due to duplicate save, send friendly message
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Property already saved'
      });
    }
    next(error);
  }
};

export const unsaveProperty = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const userId = req.user.id;

    const result = await SavedProperty.findOneAndDelete({
      userRef: userId,
      listingRef: listingId
    });

    if (!result) {
      return next(errorHandler(404, 'Saved property not found'));
    }

    res.status(200).json({
      success: true,
      message: 'Property removed from saved list'
    });
  } catch (error) {
    next(error);
  }
};

export const getSavedProperties = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const savedProperties = await SavedProperty.find({ userRef: userId })
      .populate('listingRef')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      savedProperties: savedProperties.map(sp => sp.listingRef)
    });
  } catch (error) {
    next(error);
  }
};

export const checkIfSaved = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const userId = req.user.id;

    const savedProperty = await SavedProperty.findOne({
      userRef: userId,
      listingRef: listingId
    });

    res.status(200).json({
      success: true,
      isSaved: !!savedProperty
    });
  } catch (error) {
    next(error);
  }
}; 