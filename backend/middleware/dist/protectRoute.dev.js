"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _usermodel = _interopRequireDefault(require("../models/usermodel.js"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var protectRoute = function protectRoute(req, res, next) {
  var token, decoded, user;
  return regeneratorRuntime.async(function protectRoute$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          token = req.cookies.jwt;

          if (token) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(401).json({
            message: "Unauthorized - No token provided"
          }));

        case 4:
          decoded = _jsonwebtoken["default"].verify(token, process.env.JWT_SECRET);
          _context.next = 7;
          return regeneratorRuntime.awrap(_usermodel["default"].findById(decoded._id).select("-password"));

        case 7:
          user = _context.sent;

          if (user) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return", res.status(401).json({
            message: "Unauthorized - User no longer exists"
          }));

        case 10:
          req.user = user;
          next();
          _context.next = 24;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](0);

          if (!(_context.t0.name === "JsonWebTokenError")) {
            _context.next = 20;
            break;
          }

          return _context.abrupt("return", res.status(401).json({
            message: "Unauthorized - Invalid token"
          }));

        case 20:
          if (!(_context.t0.name === "TokenExpiredError")) {
            _context.next = 22;
            break;
          }

          return _context.abrupt("return", res.status(401).json({
            message: "Unauthorized - Token expired"
          }));

        case 22:
          console.log("Error in protectRoute middleware: ", _context.t0.message);
          res.status(500).json({
            message: "Internal server error"
          });

        case 24:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

var _default = protectRoute;
exports["default"] = _default;