"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccessToken = createAccessToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
async function createAccessToken(payload) {
    return new Promise((resolve, reject) => {
        const options = { expiresIn: "1d" };
        jsonwebtoken_1.default.sign(payload, config_1.TOKEN_SECRET, options, (err, token) => {
            if (err)
                return reject(err);
            resolve(token);
        });
    });
}
