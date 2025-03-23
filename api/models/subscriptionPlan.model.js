import mongoose from 'mongoose';

const subscriptionPlanSchema = new mongoose.Schema({
  planType: {
    type: String,
    enum: ['monthly', 'quarterly', 'annually'],
    required: true
  },
  perMonth: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const SubscriptionPlan = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);

export default SubscriptionPlan; 