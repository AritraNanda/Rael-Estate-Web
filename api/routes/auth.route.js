import express from 'express';
import { signup, signin, google, signOut, signup2, signin2, google2, signOut2 } from '../controllers/auth.controller.js';

const router =express.Router();

router.post("/signup",signup);
router.post("/signin",signin);
router.post("/google",google);
router.post("/signout",signOut);

router.post("/signup2",signup2);
router.post("/signin2",signin2);
router.post("/google2",google2);
router.post("/signout2",signOut2);

export default router;