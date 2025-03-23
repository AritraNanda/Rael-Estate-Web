import express from 'express';
import { 
  adminLogin, 
  adminLogout, 
  getAdminProfile, 
  updateAdminProfile 
} from '../controllers/admin.controller.js';
import { verifyAdminToken } from '../utils/verifyAdmin.js';

const router = express.Router();

// Public routes
router.post('/login', adminLogin);
router.get('/logout', adminLogout);

// Protected routes (require admin authentication)
router.get('/profile', verifyAdminToken, getAdminProfile);
router.put('/profile', verifyAdminToken, updateAdminProfile);

export default router; 