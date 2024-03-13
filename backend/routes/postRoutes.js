import express from 'express';
import { createPost, getPost, deletePost, likeUnlikePost, replyToPost, getAllFeedPosts, getFriendFeedPosts, getUserPosts, updatePost, getLikeCount, getLikeStatus } from '../controllers/postcontroller.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

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

router.put('/:id', protectRoute, updatePost);

export default router;