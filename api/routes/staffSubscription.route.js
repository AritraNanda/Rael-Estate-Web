import express from 'express';
import { verifyStaffToken } from '../utils/verifyStaff.js';
import { 
  getSubscriptionPlans, 
  getSellerSubscription, 
  assignSubscription, 
  handleFailedPayment,
  getSubscriptionTransactions
} from '../controllers/staffSubscription.controller.js';

const router = express.Router();

// All these routes require staff authentication
router.use(verifyStaffToken);

// Get subscription plans
router.get('/plans', getSubscriptionPlans);

// Get seller's subscription status
router.get('/seller/:sellerId', getSellerSubscription);

// Assign a subscription to a seller
router.post('/assign', assignSubscription);

// Handle subscription payment failure
router.post('/payment-failure', handleFailedPayment);

// Get subscription transactions
router.get('/transactions', getSubscriptionTransactions);

export default router; 