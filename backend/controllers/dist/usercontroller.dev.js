"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addToWatchlist = exports.updateUser = exports.followUnfollowUser = exports.logoutUser = exports.loginUser = exports.signupUser = exports.getUserFollowing = exports.getUserFollowers = exports.getUserProfile = void 0;

var _userModel = _interopRequireDefault(require("../models/userModel.js"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _generateTokenAndSetCookies = _interopRequireDefault(require("../utils/helpers/generateTokenAndSetCookies.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getUserProfile = function getUserProfile(req, res) {
  var username, user;
  return regeneratorRuntime.async(function getUserProfile$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          username = req.params.username;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(_userModel["default"].findOne({
            username: username
          }).select("-password").select("-updatedAt"));

        case 4:
          user = _context.sent;

          if (user) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: "User not found"
          }));

        case 7:
          res.status(200).json(user);
          _context.next = 14;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](1);
          res.status(500).json({
            message: _context.t0.message
          });
          console.log("Error in getUserProfile: ", _context.t0.message);

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 10]]);
};

exports.getUserProfile = getUserProfile;

var getUserFollowers = function getUserFollowers(req, res) {
  var username, user, followers;
  return regeneratorRuntime.async(function getUserFollowers$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          username = req.params.username;
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(_userModel["default"].findOne({
            username: username
          }).select("-password -updatedAt"));

        case 4:
          user = _context2.sent;

          if (user) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "User not found"
          }));

        case 7:
          _context2.next = 9;
          return regeneratorRuntime.awrap(_userModel["default"].find({
            _id: {
              $in: user.followers
            }
          }).select("_id username profilepic"));

        case 9:
          followers = _context2.sent;
          res.status(200).json(followers);
          _context2.next = 17;
          break;

        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](1);
          res.status(500).json({
            message: _context2.t0.message
          });
          console.log("Error in getUserFollowers: ", _context2.t0.message);

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 13]]);
};

exports.getUserFollowers = getUserFollowers;

var getUserFollowing = function getUserFollowing(req, res) {
  var username, user, following;
  return regeneratorRuntime.async(function getUserFollowing$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          username = req.params.username;
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(_userModel["default"].findOne({
            username: username
          }).select("-password -updatedAt"));

        case 4:
          user = _context3.sent;

          if (user) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            message: "User not found"
          }));

        case 7:
          _context3.next = 9;
          return regeneratorRuntime.awrap(_userModel["default"].find({
            _id: {
              $in: user.following
            }
          }).select("_id username profilepic"));

        case 9:
          following = _context3.sent;
          res.status(200).json(following);
          _context3.next = 17;
          break;

        case 13:
          _context3.prev = 13;
          _context3.t0 = _context3["catch"](1);
          res.status(500).json({
            message: _context3.t0.message
          });
          console.log("Error in getUserFollowing: ", _context3.t0.message);

        case 17:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 13]]);
};

exports.getUserFollowing = getUserFollowing;

var signupUser = function signupUser(req, res) {
  var _req$body, username, email, password, existingUser, salt, hashedPassword, newUser;

  return regeneratorRuntime.async(function signupUser$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _req$body = req.body, username = _req$body.username, email = _req$body.email, password = _req$body.password; // Corrected: Use 'User' instead of 'user' for the model variable to match the import and avoid case sensitivity issues

          _context4.next = 4;
          return regeneratorRuntime.awrap(_userModel["default"].findOne({
            $or: [{
              email: email
            }, {
              username: username
            }]
          }));

        case 4:
          existingUser = _context4.sent;

          if (!existingUser) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            message: "User already exists"
          }));

        case 7:
          _context4.next = 9;
          return regeneratorRuntime.awrap(_bcryptjs["default"].genSalt(10));

        case 9:
          salt = _context4.sent;
          _context4.next = 12;
          return regeneratorRuntime.awrap(_bcryptjs["default"].hash(password, salt));

        case 12:
          hashedPassword = _context4.sent;
          // Corrected: Use 'User' to create a new instance
          newUser = new _userModel["default"]({
            username: username,
            email: email,
            password: hashedPassword // profilepic, followers, following, bio - Assuming these are part of your User model, ensure they are handled appropriately (either by setting defaults in the model or including them here if they are being passed in the request)

          });
          _context4.next = 16;
          return regeneratorRuntime.awrap(newUser.save());

        case 16:
          if (newUser) {
            (0, _generateTokenAndSetCookies["default"])(newUser._id, res);
            res.status(201).json({
              _id: newUser._id,
              username: newUser.username,
              email: newUser.email // Optionally include other fields you wish to return

            });
          } else {
            res.status(400).json({
              message: "Invalid user data"
            });
          }

          _context4.next = 23;
          break;

        case 19:
          _context4.prev = 19;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          res.status(500).json({
            message: "Server Error"
          });

        case 23:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 19]]);
};

exports.signupUser = signupUser;

var loginUser = function loginUser(req, res) {
  var _req$body2, email, password, user, token;

  return regeneratorRuntime.async(function loginUser$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
          _context5.next = 4;
          return regeneratorRuntime.awrap(_userModel["default"].findOne({
            email: email
          }));

        case 4:
          user = _context5.sent;
          _context5.t0 = !user;

          if (_context5.t0) {
            _context5.next = 10;
            break;
          }

          _context5.next = 9;
          return regeneratorRuntime.awrap(_bcryptjs["default"].compare(password, user.password));

        case 9:
          _context5.t0 = !_context5.sent;

        case 10:
          if (!_context5.t0) {
            _context5.next = 12;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            message: "Invalid credentials"
          }));

        case 12:
          // Assuming JWT_SECRET is your secret key for signing JWTs
          token = _jsonwebtoken["default"].sign({
            _id: user._id
          }, process.env.JWT_SECRET, {
            expiresIn: '1h'
          }); // Send the token back to the client

          res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: token // Send the token back to the client

          });
          _context5.next = 20;
          break;

        case 16:
          _context5.prev = 16;
          _context5.t1 = _context5["catch"](0);
          console.error("Error in loginUser:", _context5.t1.message);
          res.status(500).json({
            message: "Server Error"
          });

        case 20:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 16]]);
};

exports.loginUser = loginUser;

var logoutUser = function logoutUser(req, res) {
  return regeneratorRuntime.async(function logoutUser$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          try {
            res.cookie("jwt", "", {
              maxAge: 1
            });
            res.status(200).json({
              message: "User logged out"
            });
          } catch (err) {
            res.status(500).json({
              message: err.message
            });
            console.log("Error in logoutUser: ", err.message);
          }

        case 1:
        case "end":
          return _context6.stop();
      }
    }
  });
};

exports.logoutUser = logoutUser;

var followUnfollowUser = function followUnfollowUser(req, res) {
  var id, userToModify, currentUser, isFollowing;
  return regeneratorRuntime.async(function followUnfollowUser$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          id = req.params.id;
          _context7.next = 4;
          return regeneratorRuntime.awrap(_userModel["default"].findById(id));

        case 4:
          userToModify = _context7.sent;
          _context7.next = 7;
          return regeneratorRuntime.awrap(_userModel["default"].findById(req.user._id));

        case 7:
          currentUser = _context7.sent;

          if (!(id === req.user._id)) {
            _context7.next = 10;
            break;
          }

          return _context7.abrupt("return", res.status(400).json({
            message: "You cannot follow/unfollow yourself"
          }));

        case 10:
          if (!(!userToModify || !currentUser)) {
            _context7.next = 12;
            break;
          }

          return _context7.abrupt("return", res.status(400).json({
            message: "User not found"
          }));

        case 12:
          isFollowing = currentUser.following.includes(id);

          if (!isFollowing) {
            _context7.next = 21;
            break;
          }

          _context7.next = 16;
          return regeneratorRuntime.awrap(_userModel["default"].findByIdAndUpdate(req.user._id, {
            $pull: {
              following: id
            }
          }));

        case 16:
          _context7.next = 18;
          return regeneratorRuntime.awrap(_userModel["default"].findByIdAndUpdate(id, {
            $pull: {
              followers: req.user._id
            }
          }));

        case 18:
          res.status(200).json({
            message: "Unfollowed user"
          });
          _context7.next = 26;
          break;

        case 21:
          _context7.next = 23;
          return regeneratorRuntime.awrap(_userModel["default"].findByIdAndUpdate(req.user._id, {
            $push: {
              following: id
            }
          }));

        case 23:
          _context7.next = 25;
          return regeneratorRuntime.awrap(_userModel["default"].findByIdAndUpdate(id, {
            $push: {
              followers: req.user._id
            }
          }));

        case 25:
          res.status(200).json({
            message: "Followed user"
          });

        case 26:
          _context7.next = 32;
          break;

        case 28:
          _context7.prev = 28;
          _context7.t0 = _context7["catch"](0);
          res.status(500).json({
            message: _context7.t0.message
          });
          console.log("Error in followUnfollowUser: ", _context7.t0.message);

        case 32:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 28]]);
};

exports.followUnfollowUser = followUnfollowUser;

var updateUser = function updateUser(req, res) {
  var _req$body3, username, email, password, profilepic, bio, watchlist, favMovies, userId, user, salt, hashedPassword;

  return regeneratorRuntime.async(function updateUser$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _req$body3 = req.body, username = _req$body3.username, email = _req$body3.email, password = _req$body3.password, profilepic = _req$body3.profilepic, bio = _req$body3.bio, watchlist = _req$body3.watchlist, favMovies = _req$body3.favMovies;
          userId = req.user._id;
          _context8.next = 5;
          return regeneratorRuntime.awrap(_userModel["default"].findById(userId));

        case 5:
          user = _context8.sent;

          if (user) {
            _context8.next = 8;
            break;
          }

          return _context8.abrupt("return", res.status(404).json({
            message: "User not found"
          }));

        case 8:
          if (!password) {
            _context8.next = 16;
            break;
          }

          _context8.next = 11;
          return regeneratorRuntime.awrap(_bcryptjs["default"].genSalt(10));

        case 11:
          salt = _context8.sent;
          _context8.next = 14;
          return regeneratorRuntime.awrap(_bcryptjs["default"].hash(password, salt));

        case 14:
          hashedPassword = _context8.sent;
          user.password = hashedPassword;

        case 16:
          user.username = username || user.username;
          user.email = email || user.email;
          user.profilepic = profilepic || user.profilepic;
          user.bio = bio || user.bio;
          user.watchlist = watchlist || user.watchlist;
          user.favMovies = favMovies || user.favMovies;
          _context8.next = 24;
          return regeneratorRuntime.awrap(user.save());

        case 24:
          res.status(200).json({
            message: "User updated",
            user: user
          });
          _context8.next = 31;
          break;

        case 27:
          _context8.prev = 27;
          _context8.t0 = _context8["catch"](0);
          console.error("Error in updateUser:", _context8.t0);
          res.status(500).json({
            message: "Server Error"
          });

        case 31:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 27]]);
};

exports.updateUser = updateUser;

var addToWatchlist = function addToWatchlist(req, res) {
  var movieId, userId, updatedUser;
  return regeneratorRuntime.async(function addToWatchlist$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          // Extract the movieId from the request body
          movieId = req.body.movieId; // Ensure a movieId is provided

          if (movieId) {
            _context9.next = 4;
            break;
          }

          return _context9.abrupt("return", res.status(400).json({
            message: "Movie ID is required"
          }));

        case 4:
          // Use the authenticated user's ID from req.user added by the protectRoute middleware
          userId = req.user._id; // Find the user and update their watchlist to include the new movieId
          // Using $addToSet to avoid duplicate movieIds in the watchlist

          _context9.next = 7;
          return regeneratorRuntime.awrap(_userModel["default"].findByIdAndUpdate(userId, {
            $addToSet: {
              watchlist: movieId
            }
          }, {
            "new": true,
            select: "-password"
          } // Return the updated document without the password
          ));

        case 7:
          updatedUser = _context9.sent;

          if (updatedUser) {
            _context9.next = 10;
            break;
          }

          return _context9.abrupt("return", res.status(404).json({
            message: "User not found"
          }));

        case 10:
          // Respond with a success message and the updated watchlist
          res.status(200).json({
            message: "Movie added to watchlist successfully",
            watchlist: updatedUser.watchlist
          });
          _context9.next = 17;
          break;

        case 13:
          _context9.prev = 13;
          _context9.t0 = _context9["catch"](0);
          console.error("Error in addToWatchlist:", _context9.t0);
          res.status(500).json({
            message: "Server error"
          });

        case 17:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

exports.addToWatchlist = addToWatchlist;