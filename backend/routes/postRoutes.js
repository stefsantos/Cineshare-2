import express from 'express';
import multer from 'multer';
import { uploadPostImage, createPost, getPost, deletePost, likeUnlikePost, replyToPost, getAllFeedPosts, getFriendFeedPosts, getUserPosts, updatePost, getLikeCount, getLikeStatus, getMovieId} from '../controllers/postcontroller.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'postuploads/');
  },
  filename: function (req, file, cb) {
    const postId = req.params.postid;

    let filename;
    if (file.fieldname === 'postImage') {
      filename = `${postId}-image.${file.originalname.split('.').pop()}`;
    } else {
      filename = file.originalname;
    }

    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

router.get('/allfeed', protectRoute, getAllFeedPosts);
router.get('/friendfeed', protectRoute, getFriendFeedPosts);
router.get('/byUser/:username', protectRoute, getUserPosts);
router.post("/create", protectRoute, createPost);
router.get("/:id", getPost);
router.delete("/:id", protectRoute, deletePost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/reply/:id", protectRoute, replyToPost);
router.get('/likes/count/:id', protectRoute, getLikeCount);
router.get('/likes/status/:id', protectRoute, getLikeStatus);
router.get('/movie/:movieId', protectRoute, getMovieId);

router.put('/:id', protectRoute, updatePost);

// Route for uploading post images
router.post("/uploadPostImage/:postid", protectRoute, upload.single('postImage'), (req, res, next) => {
    console.log('Post Image:', req.file); // Log the uploaded post image
    uploadPostImage(req, res, next);
});

export default router;