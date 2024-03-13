"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vite = require("vite");

var _pluginReact = _interopRequireDefault(require("@vitejs/plugin-react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// https://vitejs.dev/config/
var _default = (0, _vite.defineConfig)({
  plugins: [(0, _pluginReact["default"])()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false
      }
    }
  }
});

exports["default"] = _default;