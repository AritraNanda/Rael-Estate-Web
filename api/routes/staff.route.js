import express from 'express';
import { 
  createStaff, 
  createAdmin, 
  getAllStaff, 
  getAllAdmins,
  deleteStaff,
  deleteAdmin 
} from '../controllers/staff.controller.js';
import { verifyAdminToken } from '../utils/verifyAdmin.js';

const router = express.Router();

// Staff routes
router.post('/create-staff', verifyAdminToken, createStaff);
router.get('/get-all-staff', verifyAdminToken, getAllStaff);
router.delete('/delete-staff/:id', verifyAdminToken, deleteStaff);

// Admin routes
router.post('/create-admin', verifyAdminToken, createAdmin);
router.get('/get-all-admins', verifyAdminToken, getAllAdmins);
router.delete('/delete-admin/:id', verifyAdminToken, deleteAdmin);

export default router; 