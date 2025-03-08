import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userType: {
    type: String,
    enum: ['user', 'seller'],
    required: true
  },
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    required: function() {
      return this.paymentMethod !== 'demo-card';
    }
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'demo-card'],
    default: 'card'
  },
  last4Digits: {
    type: String,
    required: true
  },
  transactionDate: {
    type: Date,
    default: Date.now
  },
  planType: {
    type: String,
    enum: ['monthly', 'quarterly', 'annually'],
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  errorMessage: {
    type: String
  }
}, { timestamps: true });

// Index for quick lookups
transactionSchema.index({ userId: 1, status: 1 });
transactionSchema.index({ subscriptionId: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction; 