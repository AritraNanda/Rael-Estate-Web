import express from 'express';
import { getTransactions } from '../controllers/transaction.controller.js';

const router = express.Router();

// Get transactions with pagination
router.get('/get-transactions', getTransactions);

export default router; 