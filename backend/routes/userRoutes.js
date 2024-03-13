import express from 'express';
import { getUserProfile, signupUser, loginUser, logoutUser, followUnfollowUser, updateUser, getUserFollowers, getUserFollowing, addToWatchlist, checkWatchlist, getWatchlist, deleteFromWatchlist, addToFavoriteMovies, checkFavoriteMovies, getFavoriteMovies, deleteFromFavoriteMovies} from '../controllers/usercontroller.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

//signup
router.get('/profile/:username', getUserProfile);
router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/follow/:id', protectRoute, followUnfollowUser);
router.post('/update/:id', protectRoute, updateUser);
router.get('/followers/:username', getUserFollowers);
router.get('/following/:username', getUserFollowing);

router.post('/watchlist/add', protectRoute, addToWatchlist);
router.post('/watchlist/check', protectRoute, checkWatchlist);
router.get('/watchlist/', protectRoute, getWatchlist);
router.post('/watchlist/delete', protectRoute, deleteFromWatchlist);

router.post('/favoriteMovies/add', protectRoute, addToFavoriteMovies);
router.post('/favoriteMovies/check', protectRoute, checkFavoriteMovies);
router.get('/favoriteMovies/', protectRoute, getFavoriteMovies);
router.post('/favoriteMovies/delete', protectRoute, deleteFromFavoriteMovies);

export default router;
