"use strict";

var _express = _interopRequireDefault(require("express"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _cors = _interopRequireDefault(require("cors"));

var _connectdb = _interopRequireDefault(require("./db/connectdb.js"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _userRoutes = _interopRequireDefault(require("./routes/userRoutes.js"));

var _postRoutes = _interopRequireDefault(require("./routes/postRoutes.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

(0, _connectdb["default"])();
var app = (0, _express["default"])();
var PORT = process.env.PORT || 3000; //Middleware

app.use((0, _cors["default"])());
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: true
}));
app.use((0, _cookieParser["default"])()); //Routes

app.use('/api/users', _userRoutes["default"]);
app.use('/api/posts', _postRoutes["default"]);
app.listen(PORT, function () {
  return console.log("Server is running on port ".concat(PORT));
});