import express from 'express';
import {test, updateUser, deleteUser, updateUser2, deleteUser2} from '../controllers/user.controller.js';
import { verifyToken, verifyToken2 } from '../utils/verifyUser.js';

const router=express.Router();

router.get('/test',test);
router.post('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)

router.post('/update2/:id', verifyToken2, updateUser2)
router.delete('/delete2/:id', verifyToken2, deleteUser2)

export default router;