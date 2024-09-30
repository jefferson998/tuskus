"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const auth = (req, res, next) => {
    try {
        // console.log(req);
        // console.log(JSON.stringify(req.cookies));
        console.log(req.headers.token);
        const token = req.headers.token;
        console.log("this is token ", token);
        if (!token) {
            res.status(401).json({ message: "No token, authorization denied" });
            return; // Detenemos aquí el flujo
        }
        jsonwebtoken_1.default.verify(token, config_1.TOKEN_SECRET, (error, user) => {
            if (error) {
                res.status(401).json({ message: "Token is not valid" });
                return; // Detenemos aquí el flujo
            }
            req.user = user; // Añadimos `user` al objeto `Request`
            next(); // Continuamos el flujo
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.auth = auth;
//# sourceMappingURL=auth.middleware.js.map