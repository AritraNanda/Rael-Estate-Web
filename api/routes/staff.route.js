import express from 'express';
import { 
  createStaff, 
  createAdmin, 
  getAllStaff, 
  getAllAdmins,
  deleteStaff,
  deleteAdmin,
  staffLogin,
  staffLogout
} from '../controllers/staff.controller.js';
import { verifyAdminToken } from '../utils/verifyAdmin.js';
import { verifyStaffToken } from '../utils/verifyStaff.js';

const router = express.Router();

// Authentication routes
router.post('/login', staffLogin);
router.get('/logout', staffLogout);

// Staff routes (protected by admin auth)
router.post('/create-staff', verifyAdminToken, createStaff);
router.get('/get-all-staff', verifyAdminToken, getAllStaff);
router.delete('/delete-staff/:id', verifyAdminToken, deleteStaff);

// Admin routes (protected by admin auth)
router.post('/create-admin', verifyAdminToken, createAdmin);
router.get('/get-all-admins', verifyAdminToken, getAllAdmins);
router.delete('/delete-admin/:id', verifyAdminToken, deleteAdmin);

export default router; 