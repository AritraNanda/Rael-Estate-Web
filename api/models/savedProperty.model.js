import mongoose from 'mongoose';

const savedPropertySchema = new mongoose.Schema({
  userRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  listingRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  }
}, { timestamps: true });

// Create a compound unique index to prevent duplicate saves
savedPropertySchema.index({ userRef: 1, listingRef: 1 }, { unique: true });

const SavedProperty = mongoose.model('SavedProperty', savedPropertySchema);

export default SavedProperty; 