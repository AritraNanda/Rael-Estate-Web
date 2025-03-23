import express from 'express';
import { 
  createStaff, 
  createAdmin, 
  getAllStaff, 
  getAllAdmins,
  deleteStaff,
  deleteAdmin 
} from '../controllers/staff.controller.js';

const router = express.Router();

// Staff routes
router.post('/create-staff', createStaff);
router.get('/get-all-staff', getAllStaff);
router.delete('/delete-staff/:id', deleteStaff);

// Admin routes
router.post('/create-admin', createAdmin);
router.get('/get-all-admins', getAllAdmins);
router.delete('/delete-admin/:id', deleteAdmin);

export default router; 