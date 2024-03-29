import User from "../models/userModel.js";
import Post from "../models/postModel.js";

const createPost = async (req, res) => {
    try {
        // Destructure the expected fields from req.body
        const { movie, movieId, content, imageUrl } = req.body;

        // Check if content is provided
        if (!content) {
            return res.status(400).json({ message: "Content is required" });
        }

        // Check if the user exists
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        // Optional: Check content length
        const maxLength = 500;
        if (content.length > maxLength) {
            return res.status(400).json({ message: `Post content must be ${maxLength} characters or less` });
        }

        // Create a new post
        let newPost = new Post({
            postedBy: req.user._id, // Assuming req.user._id is available through the protectRoute middleware
            movie,
            movieId,
            content,
            imageUrl: imageUrl || '', // Default to an empty string if imageUrl is not provided
        });

        // Save the new post to the database
        await newPost.save();

        // Populate the postedBy field to return the username in the response
        newPost = await Post.findById(newPost._id).populate('postedBy', 'username');

        // Send the created post as a response
        res.status(201).json({ message: "Post created", post: newPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getPost = async (req, res) => {
    try {
        
        const post = await Post.findById(req.params.id).populate('postedBy', 'username');

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({ message: "Post found", post });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

const deletePost = async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "post not found" });
        }

        if (post.postedBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "post deleted" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

const likeUnlikePost = async (req, res) => {

    try {

        const {id: postId} = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "post not found" });
        }

        const userLikedPost = post.likes.includes(userId);

        if (userLikedPost) {
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } })
            res.status(200).json({ message: "post unliked" });
        } else {
            post.likes.push(userId);
            await post.save();
            res.status(200).json({ message: "post liked" });
        }

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

}

const replyToPost = async (req, res) => {
    try {
        const { content } = req.body; // Updated to use `content` instead of `text`
        const postId = req.params.id;
        const userId = req.user._id;
        const userProfilePic = req.user.profilepic; // Ensure this aligns with your User schema
        const username = req.user.username;

        if (!content) {
            return res.status(400).json({ message: "Invalid reply data" });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const reply = { userId, text: content, userProfilePic, username };

        post.replies.push(reply);
        await post.save();

        res.status(201).json({ message: "Reply added", post });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllFeedPosts = async (req, res) => {
    try {
        // Fetch all posts from the database, sorted by createdAt in descending order (most recent first)
        const feedPosts = await Post.find().populate('postedBy', 'username').sort({createdAt: -1});

        // Check if there are posts available
        if (feedPosts.length === 0) {
            return res.status(404).json({message: "No posts found"});
        }

        // Return the posts if found
        res.status(200).json({message: "Feed posts found", feedPosts});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getFriendFeedPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate('postedBy', 'username');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const following = user.following;

        const feedPosts = await Post.find({postedBy: { $in: following }}).sort({createdAt: -1});

        if (feedPosts.length === 0) {
            return res.status(404).json({ message: "No friend feed posts found" });
        }
        res.status(200).json({ message: "Friend feed posts found", feedPosts });

    } catch (error) {
        res.status(500).json({ message: error.message });
        
    }
}

const getUserPosts = async (req, res) => {
    try {
        const username = req.params.username; // Or use userID based on your preference
        const user = await User.findOne({ username: username }); // Find the user by username
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const posts = await Post.find({ postedBy: user._id }).populate('postedBy', 'username').sort({ createdAt: -1 });
        if (posts.length === 0) {
            return res.status(404).json({ message: "No posts found for this user" });
        }

        res.json({ message: "Posts found", posts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { content, imageUrl } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // check if user authorized
        if (post.postedBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized to update this post" });
        }

        if (content) {
            post.content = content;
        }
        if (imageUrl) {
            post.imageUrl = imageUrl;
        }

        await post.save();

        res.status(200).json({ message: "Post updated successfully", post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getLikeCount = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json({ likeCount: post.likes.length });
    } catch (error) {
        console.error('Error fetching like count:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getLikeStatus = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const isLiked = post.likes.includes(userId);
        res.status(200).json({ isLiked });
    } catch (error) {
        console.error('Error fetching like status:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getMovieId = async (req, res) => {
    try {
        const { movieId } = req.params; 
        const posts = await Post.find({ movieId }).populate('postedBy', 'username');
        if (!posts.length) {
            return res.status(404).json({ message: "No posts found for this movie" });
        }
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


export { createPost, getPost, deletePost, likeUnlikePost, replyToPost, 
    getAllFeedPosts, getFriendFeedPosts, getUserPosts , updatePost, 
    getLikeCount, getLikeStatus, getMovieId};