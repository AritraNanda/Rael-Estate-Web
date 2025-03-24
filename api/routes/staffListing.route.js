import express from 'express';
import { createStaffListing, getStaffListings } from '../controllers/staffListing.controller.js';
import { verifyStaffToken } from '../utils/verifyStaff.js';

const router = express.Router();

// Only staff members can access these routes
router.post('/create', verifyStaffToken, createStaffListing);
router.get('/get', verifyStaffToken, getStaffListings);

export default router; 