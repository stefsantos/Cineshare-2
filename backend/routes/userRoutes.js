import express from 'express';
import multer from 'multer';
import { uploadProfilePic, uploadBanner, getUserProfile, signupUser, loginUser, logoutUser, followUnfollowUser, updateUser, getUserFollowers, getUserFollowing, addToWatchlist, checkWatchlist, getWatchlist, deleteFromWatchlist, addToFavoriteMovies, checkFavoriteMovies, getFavoriteMovies, deleteFromFavoriteMovies} from '../controllers/usercontroller.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'useruploads/');
  },
  filename: function (req, file, cb) {
    const userId = req.params.userid;

    let filename;
    if (file.fieldname === 'profilePic') {
      filename = `${userId}-pfp.${file.originalname.split('.').pop()}`;
    } else if (file.fieldname === 'banner') {
      filename = `${userId}-banner.${file.originalname.split('.').pop()}`;
    } else {
      filename = file.originalname;
    }

    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

// Routes
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
router.post('/favoriteMovies/delete', protectRoute, deleteFromFavoriteMovies);

router.post('/uploadProfilePic/:userid', protectRoute, upload.single('profilePic'), (req, res, next) => {
    console.log('Profile Pic:', req.file); // Log the uploaded profile picture
    uploadProfilePic(req, res, next);
  });
  
router.post('/uploadBanner/:userid', protectRoute, upload.single('banner'), (req, res, next) => {
    console.log('Banner:', req.file); // Log the uploaded banner
    uploadBanner(req, res, next);
});

export default router;
