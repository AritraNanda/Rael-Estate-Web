import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
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
  planType: {
    type: String,
    enum: ['monthly', 'quarterly', 'annually'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active'
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  lastPaymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }
}, { timestamps: true });

// Calculate if subscription is active
subscriptionSchema.methods.isActive = function() {
  return this.status === 'active' && this.endDate > new Date();
};

// Static method to get active subscription for a user
subscriptionSchema.statics.getActiveSubscription = async function(userId, userType) {
  return this.findOne({
    userId,
    userType,
    status: 'active',
    endDate: { $gt: new Date() }
  }).sort({ endDate: -1 });
};

// Static method to calculate new subscription dates
subscriptionSchema.statics.calculateSubscriptionDates = async function(userId, duration, userType) {
  const activeSubscription = await this.getActiveSubscription(userId, userType);
  
  const startDate = activeSubscription 
    ? new Date(activeSubscription.endDate) // Start from end of current subscription
    : new Date(); // Start from now if no active subscription

  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + duration);

  return { startDate, endDate };
};

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription; 