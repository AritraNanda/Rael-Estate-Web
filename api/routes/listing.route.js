import express from 'express';
import { createListing, deleteListing, updateListing, getListing } from '../controllers/listing.controller.js';
import { verifyToken2 } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken2, createListing);
router.delete('/delete/:id', verifyToken2, deleteListing);
router.post('/update/:id', verifyToken2, updateListing);
router.get('/get/:id', getListing);
// router.get('/get', getListings);

export default router;