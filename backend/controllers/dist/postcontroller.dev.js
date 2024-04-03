"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteComment = exports.getComments = exports.flagPost = exports.getMovieId = exports.getLikeStatus = exports.getLikeCount = exports.updatePost = exports.getUserPosts = exports.getFriendFeedPosts = exports.getAllFeedPosts = exports.replyToPost = exports.likeUnlikePost = exports.deletePost = exports.getPost = exports.createPost = exports.uploadPostImage = void 0;

var _userModel = _interopRequireDefault(require("../models/userModel.js"));

var _postModel = _interopRequireDefault(require("../models/postModel.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var uploadPostImage = function uploadPostImage(req, res) {
  var postId, post;
  return regeneratorRuntime.async(function uploadPostImage$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;

          if (req.file) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: "No file uploaded"
          }));

        case 3:
          postId = req.params.postid;
          _context.next = 6;
          return regeneratorRuntime.awrap(_postModel["default"].findById(postId));

        case 6:
          post = _context.sent;

          if (post) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            message: "Post not found"
          }));

        case 9:
          post.image = req.file.path;
          _context.next = 12;
          return regeneratorRuntime.awrap(post.save());

        case 12:
          res.status(200).json({
            message: "Post image uploaded successfully",
            imagePath: post.image
          });
          _context.next = 19;
          break;

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](0);
          console.error("Error uploading post image:", _context.t0.message);
          res.status(500).json({
            message: "Server error"
          });

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

exports.uploadPostImage = uploadPostImage;

var createPost = function createPost(req, res) {
  var _req$body, movie, movieId, content, imageUrl, user, maxLength, newPost;

  return regeneratorRuntime.async(function createPost$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          // Destructure the expected fields from req.body
          _req$body = req.body, movie = _req$body.movie, movieId = _req$body.movieId, content = _req$body.content, imageUrl = _req$body.imageUrl; // Check if content is provided

          if (content) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "Content is required"
          }));

        case 4:
          _context2.next = 6;
          return regeneratorRuntime.awrap(_userModel["default"].findById(req.user._id));

        case 6:
          user = _context2.sent;

          if (user) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "User does not exist"
          }));

        case 9:
          // Optional: Check content length
          maxLength = 500;

          if (!(content.length > maxLength)) {
            _context2.next = 12;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "Post content must be ".concat(maxLength, " characters or less")
          }));

        case 12:
          // Create a new post
          newPost = new _postModel["default"]({
            postedBy: req.user._id,
            // Assuming req.user._id is available through the protectRoute middleware
            movie: movie,
            movieId: movieId,
            content: content,
            imageUrl: imageUrl || '' // Default to an empty string if imageUrl is not provided

          }); // Save the new post to the database

          _context2.next = 15;
          return regeneratorRuntime.awrap(newPost.save());

        case 15:
          _context2.next = 17;
          return regeneratorRuntime.awrap(_postModel["default"].findById(newPost._id).populate('postedBy', 'username'));

        case 17:
          newPost = _context2.sent;
          // Send the created post as a response
          res.status(201).json({
            message: "Post created",
            post: newPost
          });
          _context2.next = 25;
          break;

        case 21:
          _context2.prev = 21;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          res.status(500).json({
            message: "Server Error"
          });

        case 25:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 21]]);
};

exports.createPost = createPost;

var getPost = function getPost(req, res) {
  var post;
  return regeneratorRuntime.async(function getPost$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(_postModel["default"].findById(req.params.id).populate('postedBy', 'username'));

        case 3:
          post = _context3.sent;

          if (post) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: "Post not found"
          }));

        case 6:
          res.status(200).json({
            message: "Post found",
            post: post
          });
          _context3.next = 13;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          res.status(500).json({
            message: _context3.t0.message
          });

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.getPost = getPost;

var deletePost = function deletePost(req, res) {
  var adminId, post;
  return regeneratorRuntime.async(function deletePost$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          adminId = "660968f9677e962852eee30b";
          _context4.prev = 1;
          _context4.next = 4;
          return regeneratorRuntime.awrap(_postModel["default"].findById(req.params.id));

        case 4:
          post = _context4.sent;

          if (post) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: "post not found"
          }));

        case 7:
          if (!(post.postedBy.toString() !== req.user._id.toString() && req.user._id.toString() !== adminId)) {
            _context4.next = 9;
            break;
          }

          return _context4.abrupt("return", res.status(401).json({
            message: "Unauthorized"
          }));

        case 9:
          _context4.next = 11;
          return regeneratorRuntime.awrap(_postModel["default"].findByIdAndDelete(req.params.id));

        case 11:
          res.status(200).json({
            message: "post deleted"
          });
          _context4.next = 17;
          break;

        case 14:
          _context4.prev = 14;
          _context4.t0 = _context4["catch"](1);
          res.status(500).json({
            message: _context4.t0.message
          });

        case 17:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 14]]);
};

exports.deletePost = deletePost;

var likeUnlikePost = function likeUnlikePost(req, res) {
  var postId, userId, post, userLikedPost;
  return regeneratorRuntime.async(function likeUnlikePost$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          postId = req.params.id;
          userId = req.user._id;
          _context5.next = 5;
          return regeneratorRuntime.awrap(_postModel["default"].findById(postId));

        case 5:
          post = _context5.sent;

          if (post) {
            _context5.next = 8;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            message: "post not found"
          }));

        case 8:
          userLikedPost = post.likes.includes(userId);

          if (!userLikedPost) {
            _context5.next = 15;
            break;
          }

          _context5.next = 12;
          return regeneratorRuntime.awrap(_postModel["default"].updateOne({
            _id: postId
          }, {
            $pull: {
              likes: userId
            }
          }));

        case 12:
          res.status(200).json({
            message: "post unliked"
          });
          _context5.next = 19;
          break;

        case 15:
          post.likes.push(userId);
          _context5.next = 18;
          return regeneratorRuntime.awrap(post.save());

        case 18:
          res.status(200).json({
            message: "post liked"
          });

        case 19:
          _context5.next = 24;
          break;

        case 21:
          _context5.prev = 21;
          _context5.t0 = _context5["catch"](0);
          res.status(500).json({
            message: _context5.t0.message
          });

        case 24:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 21]]);
};

exports.likeUnlikePost = likeUnlikePost;

var replyToPost = function replyToPost(req, res) {
  var content, postId, userId, userProfilePic, username, post, reply;
  return regeneratorRuntime.async(function replyToPost$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          content = req.body.content; // Updated to use `content` instead of `text`

          postId = req.params.id;
          userId = req.user._id;
          userProfilePic = req.user.profilepic; // Ensure this aligns with your User schema

          username = req.user.username;

          if (content) {
            _context6.next = 8;
            break;
          }

          return _context6.abrupt("return", res.status(400).json({
            message: "Invalid reply data"
          }));

        case 8:
          _context6.next = 10;
          return regeneratorRuntime.awrap(_postModel["default"].findById(postId));

        case 10:
          post = _context6.sent;

          if (post) {
            _context6.next = 13;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            message: "Post not found"
          }));

        case 13:
          reply = {
            userId: userId,
            text: content,
            userProfilePic: userProfilePic,
            username: username
          };
          post.replies.push(reply);
          _context6.next = 17;
          return regeneratorRuntime.awrap(post.save());

        case 17:
          res.status(201).json({
            message: "Reply added",
            post: post
          });
          _context6.next = 23;
          break;

        case 20:
          _context6.prev = 20;
          _context6.t0 = _context6["catch"](0);
          res.status(500).json({
            message: _context6.t0.message
          });

        case 23:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 20]]);
};

exports.replyToPost = replyToPost;

var getAllFeedPosts = function getAllFeedPosts(req, res) {
  var page, limit, skipIndex, feedPosts, totalPosts, hasMore;
  return regeneratorRuntime.async(function getAllFeedPosts$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          page = parseInt(req.query.page) || 1; // Default to page 1 if not specified

          limit = parseInt(req.query.limit) || 10; // Default to 10 posts per page if not specified

          skipIndex = (page - 1) * limit;
          _context7.prev = 3;
          _context7.next = 6;
          return regeneratorRuntime.awrap(_postModel["default"].find().populate('postedBy', 'username').sort({
            createdAt: -1
          }).limit(limit).skip(skipIndex));

        case 6:
          feedPosts = _context7.sent;
          _context7.next = 9;
          return regeneratorRuntime.awrap(_postModel["default"].countDocuments());

        case 9:
          totalPosts = _context7.sent;
          // To check if more posts are available
          hasMore = skipIndex + limit < totalPosts;

          if (!(feedPosts.length === 0)) {
            _context7.next = 13;
            break;
          }

          return _context7.abrupt("return", res.status(404).json({
            message: "No posts found"
          }));

        case 13:
          res.status(200).json({
            message: "Feed posts found",
            feedPosts: feedPosts,
            hasMore: hasMore
          });
          _context7.next = 19;
          break;

        case 16:
          _context7.prev = 16;
          _context7.t0 = _context7["catch"](3);
          res.status(500).json({
            message: _context7.t0.message
          });

        case 19:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[3, 16]]);
};

exports.getAllFeedPosts = getAllFeedPosts;

var getFriendFeedPosts = function getFriendFeedPosts(req, res) {
  var userId, user, feedPosts;
  return regeneratorRuntime.async(function getFriendFeedPosts$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          userId = req.user._id; // Retrieve the logged-in user's following list. Make sure the following field is indexed.

          _context8.next = 4;
          return regeneratorRuntime.awrap(_userModel["default"].findById(userId).select('following'));

        case 4:
          user = _context8.sent;

          if (user) {
            _context8.next = 7;
            break;
          }

          return _context8.abrupt("return", res.status(404).json({
            message: "User not found. Make sure you're logged in and try again."
          }));

        case 7:
          if (!(user.following.length === 0)) {
            _context8.next = 9;
            break;
          }

          return _context8.abrupt("return", res.status(200).json({
            message: "You're not following anyone yet. Follow someone to see their posts here."
          }));

        case 9:
          _context8.next = 11;
          return regeneratorRuntime.awrap(_postModel["default"].find({
            'postedBy': {
              $in: user.following
            }
          }).populate('postedBy', 'username').sort({
            createdAt: -1
          }).limit(20));

        case 11:
          feedPosts = _context8.sent;
          // Consider adding pagination to limit the number of posts
          // Return the posts if found
          res.status(200).json({
            message: "Feed posts found",
            feedPosts: feedPosts
          });
          _context8.next = 19;
          break;

        case 15:
          _context8.prev = 15;
          _context8.t0 = _context8["catch"](0);
          console.error("Error fetching friend feed posts:", _context8.t0);
          res.status(500).json({
            message: "An error occurred while trying to fetch the feed. Please try again later."
          });

        case 19:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

exports.getFriendFeedPosts = getFriendFeedPosts;

var getUserPosts = function getUserPosts(req, res) {
  var username, user, posts;
  return regeneratorRuntime.async(function getUserPosts$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          username = req.params.username; // Or use userID based on your preference

          _context9.next = 4;
          return regeneratorRuntime.awrap(_userModel["default"].findOne({
            username: username
          }));

        case 4:
          user = _context9.sent;

          if (user) {
            _context9.next = 7;
            break;
          }

          return _context9.abrupt("return", res.status(404).json({
            message: "User not found"
          }));

        case 7:
          _context9.next = 9;
          return regeneratorRuntime.awrap(_postModel["default"].find({
            postedBy: user._id
          }).populate('postedBy', 'username').sort({
            createdAt: -1
          }));

        case 9:
          posts = _context9.sent;

          if (!(posts.length === 0)) {
            _context9.next = 12;
            break;
          }

          return _context9.abrupt("return", res.status(404).json({
            message: "No posts found for this user"
          }));

        case 12:
          res.json({
            message: "Posts found",
            posts: posts
          });
          _context9.next = 19;
          break;

        case 15:
          _context9.prev = 15;
          _context9.t0 = _context9["catch"](0);
          console.error(_context9.t0);
          res.status(500).json({
            message: "Server error"
          });

        case 19:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

exports.getUserPosts = getUserPosts;

var updatePost = function updatePost(req, res) {
  var postId, content, imageUrl, post;
  return regeneratorRuntime.async(function updatePost$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          postId = req.params.id;
          content = req.body.content;
          imageUrl = req.body.imageUrl;
          _context10.next = 6;
          return regeneratorRuntime.awrap(_postModel["default"].findById(postId));

        case 6:
          post = _context10.sent;

          if (post) {
            _context10.next = 9;
            break;
          }

          return _context10.abrupt("return", res.status(404).json({
            message: "Post not found"
          }));

        case 9:
          if (!(post.postedBy.toString() !== req.user._id.toString())) {
            _context10.next = 11;
            break;
          }

          return _context10.abrupt("return", res.status(401).json({
            message: "Unauthorized to update this post"
          }));

        case 11:
          // If there's a post image uploaded, update the imageUrl
          if (req.file) {
            imageUrl = req.file.path;
          } // Update the post content and imageUrl if provided


          if (content) {
            post.content = content;
          }

          if (imageUrl) {
            post.imageUrl = imageUrl;
          }

          _context10.next = 16;
          return regeneratorRuntime.awrap(post.save());

        case 16:
          res.status(200).json({
            message: "Post updated successfully",
            post: post
          });
          _context10.next = 23;
          break;

        case 19:
          _context10.prev = 19;
          _context10.t0 = _context10["catch"](0);
          console.error(_context10.t0);
          res.status(500).json({
            message: "Server Error"
          });

        case 23:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 19]]);
};

exports.updatePost = updatePost;

var getLikeCount = function getLikeCount(req, res) {
  var postId, post;
  return regeneratorRuntime.async(function getLikeCount$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          postId = req.params.id;
          _context11.next = 4;
          return regeneratorRuntime.awrap(_postModel["default"].findById(postId));

        case 4:
          post = _context11.sent;

          if (post) {
            _context11.next = 7;
            break;
          }

          return _context11.abrupt("return", res.status(404).json({
            message: "Post not found"
          }));

        case 7:
          res.status(200).json({
            likeCount: post.likes.length
          });
          _context11.next = 14;
          break;

        case 10:
          _context11.prev = 10;
          _context11.t0 = _context11["catch"](0);
          console.error('Error fetching like count:', _context11.t0);
          res.status(500).json({
            message: "Server error",
            error: _context11.t0.message
          });

        case 14:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.getLikeCount = getLikeCount;

var getLikeStatus = function getLikeStatus(req, res) {
  var postId, userId, post, isLiked;
  return regeneratorRuntime.async(function getLikeStatus$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          postId = req.params.id;
          userId = req.user._id;
          _context12.next = 5;
          return regeneratorRuntime.awrap(_postModel["default"].findById(postId));

        case 5:
          post = _context12.sent;

          if (post) {
            _context12.next = 8;
            break;
          }

          return _context12.abrupt("return", res.status(404).json({
            message: "Post not found"
          }));

        case 8:
          isLiked = post.likes.includes(userId);
          res.status(200).json({
            isLiked: isLiked
          });
          _context12.next = 16;
          break;

        case 12:
          _context12.prev = 12;
          _context12.t0 = _context12["catch"](0);
          console.error('Error fetching like status:', _context12.t0);
          res.status(500).json({
            message: "Server error",
            error: _context12.t0.message
          });

        case 16:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

exports.getLikeStatus = getLikeStatus;

var getMovieId = function getMovieId(req, res) {
  var movieId, posts;
  return regeneratorRuntime.async(function getMovieId$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          movieId = req.params.movieId;
          _context13.next = 4;
          return regeneratorRuntime.awrap(_postModel["default"].find({
            movieId: movieId
          }).populate('postedBy', 'username'));

        case 4:
          posts = _context13.sent;

          if (posts.length) {
            _context13.next = 7;
            break;
          }

          return _context13.abrupt("return", res.status(404).json({
            message: "No posts found for this movie"
          }));

        case 7:
          res.status(200).json(posts);
          _context13.next = 14;
          break;

        case 10:
          _context13.prev = 10;
          _context13.t0 = _context13["catch"](0);
          console.error(_context13.t0);
          res.status(500).json({
            message: "Server error"
          });

        case 14:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.getMovieId = getMovieId;

var flagPost = function flagPost(req, res) {
  var postId, post;
  return regeneratorRuntime.async(function flagPost$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          postId = req.params.id;
          _context14.next = 4;
          return regeneratorRuntime.awrap(_postModel["default"].findById(postId));

        case 4:
          post = _context14.sent;

          if (post) {
            _context14.next = 7;
            break;
          }

          return _context14.abrupt("return", res.status(404).json({
            message: "Post not found"
          }));

        case 7:
          if (post.isFlagged) {
            _context14.next = 10;
            break;
          }

          _context14.next = 10;
          return regeneratorRuntime.awrap(_postModel["default"].findOneAndUpdate({
            _id: postId
          }, {
            isFlagged: true
          }));

        case 10:
          res.status(200).json({
            message: "Post flagged successfully"
          });
          _context14.next = 17;
          break;

        case 13:
          _context14.prev = 13;
          _context14.t0 = _context14["catch"](0);
          console.error(_context14.t0);
          res.status(500).json({
            message: "Server error"
          });

        case 17:
        case "end":
          return _context14.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

exports.flagPost = flagPost;

var getComments = function getComments(req, res) {
  var postId, post;
  return regeneratorRuntime.async(function getComments$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.prev = 0;
          postId = req.params.id;
          console.log("Fetching comments for postId: ".concat(postId));
          _context15.next = 5;
          return regeneratorRuntime.awrap(_postModel["default"].findById(postId));

        case 5:
          post = _context15.sent;

          if (post) {
            _context15.next = 8;
            break;
          }

          return _context15.abrupt("return", res.status(404).json({
            message: "Post not found"
          }));

        case 8:
          console.log(post.replies);
          res.status(200).json({
            comments: post.replies
          });
          _context15.next = 16;
          break;

        case 12:
          _context15.prev = 12;
          _context15.t0 = _context15["catch"](0);
          console.error(_context15.t0);
          res.status(500).json({
            message: "Server error"
          });

        case 16:
        case "end":
          return _context15.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

exports.getComments = getComments;

var deleteComment = function deleteComment(req, res) {
  var commentId, adminId, post;
  return regeneratorRuntime.async(function deleteComment$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          commentId = req.params.commentId;
          adminId = "660968f9677e962852eee30b";
          _context16.prev = 2;
          _context16.next = 5;
          return regeneratorRuntime.awrap(_postModel["default"].findOne({
            "replies._id": commentId
          }));

        case 5:
          post = _context16.sent;

          if (post) {
            _context16.next = 8;
            break;
          }

          return _context16.abrupt("return", res.status(404).json({
            message: "Post not found with comment: ".concat(commentId)
          }));

        case 8:
          _context16.next = 10;
          return regeneratorRuntime.awrap(_postModel["default"].findOneAndUpdate({
            _id: post._id
          }, {
            $pull: {
              replies: {
                _id: commentId
              }
            }
          }));

        case 10:
          res.status(200).json({
            message: "Comment deleted successfully"
          });
          _context16.next = 17;
          break;

        case 13:
          _context16.prev = 13;
          _context16.t0 = _context16["catch"](2);
          console.error("Error deleting comment:", _context16.t0);
          res.status(500).json({
            message: "Server error",
            error: _context16.t0.message
          });

        case 17:
        case "end":
          return _context16.stop();
      }
    }
  }, null, null, [[2, 13]]);
};

exports.deleteComment = deleteComment;