import User from "../models/userModel.js";
import Post from "../models/postModel.js";

const uploadPostImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const postId = req.params.postid;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        post.image = req.file.path;

        await post.save();

        res.status(200).json({ message: "Post image uploaded successfully", imagePath: post.image });
    } catch (error) {
        console.error("Error uploading post image:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

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

    const adminId = "660968f9677e962852eee30b";

    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "post not found" });
        }

        if (post.postedBy.toString() !== req.user._id.toString() && req.user._id.toString() !== adminId) {
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
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const limit = parseInt(req.query.limit) || 10; // Default to 10 posts per page if not specified
    const skipIndex = (page - 1) * limit;

    try {
        const feedPosts = await Post.find()
            .populate('postedBy', 'username')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skipIndex);

        const totalPosts = await Post.countDocuments(); // To check if more posts are available
        const hasMore = skipIndex + limit < totalPosts;

        if (feedPosts.length === 0) {
            return res.status(404).json({ message: "No posts found" });
        }

        res.status(200).json({ message: "Feed posts found", feedPosts, hasMore });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getFriendFeedPosts = async (req, res) => {
    try {
        const userId = req.user._id;

        // Retrieve the logged-in user's following list. Make sure the following field is indexed.
        const user = await User.findById(userId).select('following');
        if (!user) {
            return res.status(404).json({ message: "User not found. Make sure you're logged in and try again." });
        }
        
        if (user.following.length === 0) {
            // If the user isn't following anyone, return an early response
            return res.status(200).json({ message: "You're not following anyone yet. Follow someone to see their posts here." });
        }

        // Fetch posts only from users the logged-in user is following, sorted by createdAt
        const feedPosts = await Post.find({
            'postedBy': { $in: user.following }
        })
        .populate('postedBy', 'username')
        .sort({createdAt: -1})
        .limit(20); // Consider adding pagination to limit the number of posts

        // Return the posts if found
        res.status(200).json({message: "Feed posts found", feedPosts});
    } catch (error) {
        console.error("Error fetching friend feed posts:", error);
        res.status(500).json({ message: "An error occurred while trying to fetch the feed. Please try again later." });
    }
};



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
      const { content } = req.body;
      let { imageUrl } = req.body;
  
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      // Check if the user is authorized to update this post
      if (post.postedBy.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "Unauthorized to update this post" });
      }
  
      // If there's a post image uploaded, update the imageUrl
      if (req.file) {

        imageUrl = req.file.path; 
      }
  
      // Update the post content and imageUrl if provided
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

const flagPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) 
        {
            return res.status(404).json({ message: "Post not found" });
        }

        if (!post.isFlagged) 
        {
            await Post.findOneAndUpdate({ _id: postId }, { isFlagged: true });
        }

        res.status(200).json({ message: "Post flagged successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const getComments = async (req, res) => {
    try {
        const postId = req.params.id; 
        console.log(`Fetching comments for postId: ${postId}`); 
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        console.log(post.replies); 
        res.status(200).json({ comments: post.replies });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};



export { uploadPostImage, createPost, getPost, deletePost, likeUnlikePost, replyToPost, 
    getAllFeedPosts, getFriendFeedPosts, getUserPosts , updatePost, 
    getLikeCount, getLikeStatus, getMovieId, flagPost, getComments};