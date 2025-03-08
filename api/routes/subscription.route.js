import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import Subscription from '../models/subscription.model.js';
import Transaction from '../models/transaction.model.js';

const router = express.Router();

// Process payment and create subscription
router.post('/process-payment', verifyToken, async (req, res) => {
  try {
    const { amount, duration, planType, last4Digits } = req.body;
    
    // Create transaction record
    const transaction = new Transaction({
      userId: req.user.id,
      amount,
      planType,
      duration,
      last4Digits,
      status: 'pending'
    });

    // Calculate subscription end date
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + duration);

    // Create subscription
    const subscription = new Subscription({
      userId: req.user.id,
      planType,
      amount,
      startDate: new Date(),
      endDate,
      autoRenew: true
    });

    // Save subscription first to get its ID
    await subscription.save();

    // Update transaction with subscription ID
    transaction.subscriptionId = subscription._id;
    transaction.status = 'success';
    await transaction.save();

    // Update subscription with payment ID
    subscription.lastPaymentId = transaction._id;
    await subscription.save();

    res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      subscription,
      transaction
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing payment',
      error: error.message
    });
  }
});

// Get subscription status
router.get('/status', verifyToken, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      userId: req.user.id,
      status: 'active'
    }).sort({ createdAt: -1 });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'No active subscription found'
      });
    }

    res.status(200).json({
      success: true,
      subscription,
      isActive: subscription.isActive()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subscription status',
      error: error.message
    });
  }
});

// Get transaction history
router.get('/transactions', verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user.id
    })
    .sort({ createdAt: -1 })
    .limit(10);

    res.status(200).json({
      success: true,
      transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching transaction history',
      error: error.message
    });
  }
});

// Cancel subscription
router.post('/cancel', verifyToken, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      userId: req.user.id,
      status: 'active'
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'No active subscription found'
      });
    }

    subscription.status = 'cancelled';
    subscription.autoRenew = false;
    await subscription.save();

    res.status(200).json({
      success: true,
      message: 'Subscription cancelled successfully',
      subscription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling subscription',
      error: error.message
    });
  }
});

export default router; 