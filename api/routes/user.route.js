import express from 'express';
import {test, updateUser, deleteUser, updateUser2, deleteUser2, getUserListings, getUser, findUserByEmail} from '../controllers/user.controller.js';
import { verifyToken, verifyToken2 } from '../utils/verifyUser.js';
import { verifyStaffToken } from '../utils/verifyStaff.js';

const router=express.Router();

router.get('/test',test);
router.post('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)

router.post('/update2/:id', verifyToken2, updateUser2)
router.delete('/delete2/:id', verifyToken2, deleteUser2)
router.get('/listings/:id', verifyToken2, getUserListings)

// Place specific routes before dynamic parameter routes
router.get('/find-by-email', verifyStaffToken, findUserByEmail)

// Place the dynamic parameter route last
router.get('/:id', verifyToken, getUser)

export default router;