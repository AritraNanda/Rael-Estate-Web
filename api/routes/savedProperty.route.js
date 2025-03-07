import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import {
  saveProperty,
  unsaveProperty,
  getSavedProperties,
  checkIfSaved
} from '../controllers/savedProperty.controller.js';

const router = express.Router();

router.post('/save', verifyToken, saveProperty);
router.delete('/unsave/:listingId', verifyToken, unsaveProperty);
router.get('/get', verifyToken, getSavedProperties);
router.get('/check/:listingId', verifyToken, checkIfSaved);

export default router; 