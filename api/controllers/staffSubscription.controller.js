import Subscription from '../models/subscription.model.js';
import SubscriptionPlan from '../models/subscriptionPlan.model.js';
import Seller from '../models/seller.model.js';
import Transaction from '../models/transaction.model.js';
import { errorHandler } from '../utils/error.js';

// Get subscription plans for staff
export const getSubscriptionPlans = async (req, res, next) => {
  try {
    const plans = await SubscriptionPlan.find().sort({ duration: 1 });
    
    res.status(200).json({
      success: true,
      plans
    });
  } catch (error) {
    next(error);
  }
};

// Get seller's subscription status
export const getSellerSubscription = async (req, res, next) => {
  try {
    const { sellerId } = req.params;
    
    // Verify seller exists
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return next(errorHandler(404, 'Seller not found'));
    }
    
    // Get active subscription
    const subscription = await Subscription.getActiveSubscription(sellerId, 'seller');
    
    res.status(200).json({
      success: true,
      seller: {
        id: seller._id,
        name: seller.username,
        email: seller.email
      },
      hasActiveSubscription: !!subscription,
      subscription
    });
  } catch (error) {
    next(error);
  }
};

// Assign a subscription to a seller (cash payment)
export const assignSubscription = async (req, res, next) => {
  try {
    const { sellerId, planType, paymentMethod, staffNote } = req.body;
    
    if (!sellerId || !planType || !paymentMethod) {
      return next(errorHandler(400, 'Missing required fields'));
    }
    
    // Validate seller exists
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return next(errorHandler(404, 'Seller not found'));
    }
    
    // Get subscription plan
    const plan = await SubscriptionPlan.findOne({ planType });
    if (!plan) {
      return next(errorHandler(404, 'Subscription plan not found'));
    }
    
    // Calculate subscription dates
    const { startDate, endDate } = await Subscription.calculateSubscriptionDates(
      sellerId, 
      plan.duration,
      'seller'
    );
    
    // Create transaction record for the payment
    const transaction = new Transaction({
      userId: sellerId,
      userType: 'seller',
      amount: plan.total,
      // Use demo-card for paymentMethod as it's allowed in the schema
      paymentMethod: 'demo-card',
      // Use success status as it's allowed in the schema
      status: 'success',
      // Set last4Digits to a default value as it's required
      last4Digits: '0000',
      // Map plan type - convert if needed
      planType: plan.planType === 'basic' || plan.planType === 'standard' || plan.planType === 'premium' 
               ? 'monthly' : plan.planType,
      duration: plan.duration
    });
    
    await transaction.save();
    
    // Create or update subscription
    const subscription = new Subscription({
      userId: sellerId,
      userType: 'seller',
      planType: plan.planType === 'basic' || plan.planType === 'standard' || plan.planType === 'premium' 
               ? 'monthly' : plan.planType,
      status: 'active',
      startDate,
      endDate,
      amount: plan.total,
      lastPaymentId: transaction._id
    });
    
    await subscription.save();
    
    // Update the transaction with the subscription ID
    transaction.subscriptionId = subscription._id;
    await transaction.save();
    
    res.status(201).json({
      success: true,
      message: `Successfully assigned ${plan.label} subscription to seller`,
      subscription,
      transaction
    });
  } catch (error) {
    next(error);
  }
};

// Handle subscription payment failure
export const handleFailedPayment = async (req, res, next) => {
  try {
    const { sellerId, reason } = req.body;
    
    if (!sellerId || !reason) {
      return next(errorHandler(400, 'Missing required fields'));
    }
    
    // Validate seller exists
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return next(errorHandler(404, 'Seller not found'));
    }
    
    // Get active subscription
    const subscription = await Subscription.getActiveSubscription(sellerId, 'seller');
    
    if (!subscription) {
      return next(errorHandler(404, 'No active subscription found for this seller'));
    }
    
    // Create transaction record for the failed payment
    const transaction = new Transaction({
      userId: sellerId,
      userType: 'seller',
      amount: subscription.amount,
      // Use demo-card for paymentMethod as it's allowed in the schema
      paymentMethod: 'demo-card',
      // Use failed status as it's allowed in the schema
      status: 'failed',
      // Set last4Digits to a default value as it's required
      last4Digits: '0000',
      subscriptionId: subscription._id,
      planType: subscription.planType,
      duration: subscription.planType === 'monthly' ? 1 : 
                subscription.planType === 'quarterly' ? 3 : 12,
      errorMessage: reason
    });
    
    await transaction.save();
    
    // Update subscription if needed (e.g., mark as expired)
    // This depends on your business logic - you might want to:
    // 1. Leave it active but log the failed payment
    // 2. Mark it as expired
    // 3. Set a special status like "grace period"
    
    // For this example, we'll leave it active but log the failed payment
    
    res.status(200).json({
      success: true,
      message: 'Payment failure has been recorded',
      transaction
    });
  } catch (error) {
    next(error);
  }
};

// Get recent subscription transactions
export const getSubscriptionTransactions = async (req, res, next) => {
  try {
    const { sellerId } = req.query;
    const query = { userType: 'seller' };
    
    if (sellerId) {
      query.userId = sellerId;
    }
    
    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('userId', 'username email');
      
    res.status(200).json({
      success: true,
      transactions
    });
  } catch (error) {
    next(error);
  }
}; 