"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _usercontroller = require("../controllers/usercontroller.js");

var _protectRoute = _interopRequireDefault(require("../middleware/protectRoute.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router(); //signup


router.get('/profile/:username', _usercontroller.getUserProfile);
router.post('/signup', _usercontroller.signupUser);
router.post('/login', _usercontroller.loginUser);
router.post('/logout', _usercontroller.logoutUser);
router.post('/follow/:id', _protectRoute["default"], _usercontroller.followUnfollowUser);
router.post('/update/:id', _protectRoute["default"], _usercontroller.updateUser);
router.get('/followers/:username', _usercontroller.getUserFollowers);
router.get('/following/:username', _usercontroller.getUserFollowing);
router.post('/watchlist/add', _protectRoute["default"], _usercontroller.addToWatchlist);
router.post('/watchlist/check', _protectRoute["default"], _usercontroller.checkWatchlist);
router.get('/watchlist/', _protectRoute["default"], _usercontroller.getWatchlist);
var _default = router;
exports["default"] = _default;