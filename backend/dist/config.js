"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FRONTEND_URL = exports.TOKEN_SECRET = exports.MONGODB_URI = exports.PORT = void 0;
exports.PORT = process.env.PORT || 4000;
exports.MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://fitkro:lQ87dPzG6DCWUbwX@tuskusapi.dahkp.mongodb.net/tuskus?retryWrites=true&w=majority&appName=tuskusapi";
exports.TOKEN_SECRET = process.env.JWT_SECRET || "secret";
exports.FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
//# sourceMappingURL=config.js.map