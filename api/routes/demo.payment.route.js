import express from 'express';
import { verifyToken2 } from '../utils/verifyUser.js';
import Transaction from '../models/transaction.model.js';
import Subscription from '../models/subscription.model.js';
import mongoose from 'mongoose';

const router = express.Router();

// Process demo payment
router.post('/process', verifyToken2, async (req, res) => {
  try {
    const { amount, duration, planType, last4Digits } = req.body;
    
    // Create transaction record
    const transaction = new Transaction({
      userId: req.user.id,
      userType: 'seller',
      amount,
      planType,
      duration,
      last4Digits,
      status: 'pending',
      paymentMethod: 'demo-card',
      currency: 'INR',
      transactionDate: new Date()
    });

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update transaction status based on the demo card used
    const isSuccessCard = last4Digits === '1111'; // Success card ends with 1111
    
    if (isSuccessCard) {
      // Calculate subscription dates
      const { startDate, endDate } = await Subscription.calculateSubscriptionDates(req.user.id, duration);

      // Create or update subscription
      const subscription = new Subscription({
        userId: req.user.id,
        userType: 'seller',
        planType,
        amount,
        startDate,
        endDate
      });

      // Save subscription
      await subscription.save();

      // Update transaction with subscription ID and success status
      transaction.subscriptionId = subscription._id;
      transaction.status = 'success';
      await transaction.save();

      // Update subscription with payment ID
      subscription.lastPaymentId = transaction._id;
      await subscription.save();

      res.status(200).json({
        success: true,
        message: 'Demo payment processed successfully',
        transaction,
        subscription
      });
    } else {
      transaction.status = 'failed';
      transaction.errorMessage = 'Payment failed with demo card';
      await transaction.save();

      res.status(400).json({
        success: false,
        message: 'Demo payment failed',
        transaction
      });
    }
  } catch (error) {
    console.error('Demo payment processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing demo payment',
      error: error.message
    });
  }
});

// Get subscription status
router.get('/subscription-status', verifyToken2, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      userId: req.user.id,
      userType: 'seller',
      status: 'active',
      endDate: { $gt: new Date() }
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      hasActiveSubscription: !!subscription,
      subscription
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
router.get('/history', verifyToken2, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user.id,
      userType: 'seller',
      paymentMethod: 'demo-card'
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

export default router; 