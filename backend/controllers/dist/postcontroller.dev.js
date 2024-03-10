"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPost = void 0;

var _postModel = _interopRequireDefault(require("../models/postModel.js"));

var _userModel = _interopRequireDefault(require("../models/userModel.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var createPost = function createPost(req, res) {
  var _req$body, postedBy, text, img, user, maxLength, newPost;

  return regeneratorRuntime.async(function createPost$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, postedBy = _req$body.postedBy, text = _req$body.text, img = _req$body.img;

          if (!(!postedBy || !text)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: "Please fill in all fields"
          }));

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(_userModel["default"].findById(postedBy));

        case 6:
          user = _context.sent;

          if (user) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: "User not found"
          }));

        case 9:
          if (!(user._id.toString() !== postedBy)) {
            _context.next = 11;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: "User not authorized"
          }));

        case 11:
          maxLength = 500;

          if (!(text.length > maxLength)) {
            _context.next = 14;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: "Text must be less than ".concat(maxLength, " characters")
          }));

        case 14:
          newPost = new _postModel["default"]({
            postedBy: postedBy,
            text: text,
            img: img
          });
          _context.next = 17;
          return regeneratorRuntime.awrap(newPost.save());

        case 17:
          res.status(201).json({
            message: "Post created successfully"
          });
          _context.next = 24;
          break;

        case 20:
          _context.prev = 20;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            message: _context.t0.message
          });
          console.log(_context.t0.message);

        case 24:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 20]]);
};

exports.createPost = createPost;