import express from 'express';
import { getUserProfile, signupUser, loginUser, logoutUser, followUnfollowUser, updateUser } from '../controllers/usercontroller.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

//signup
router.get('/profile/:username', getUserProfile);
router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/follow/:id', protectRoute, followUnfollowUser);
router.post('/update/:id', protectRoute, updateUser);

//signin
export default router;
