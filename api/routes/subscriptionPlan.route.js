import express from 'express';
import { getSubscriptionPlans, updateSubscriptionPlans } from '../controllers/subscriptionPlan.controller.js';

const router = express.Router();

router.get('/', getSubscriptionPlans);
router.put('/update-all', updateSubscriptionPlans);

export default router; 