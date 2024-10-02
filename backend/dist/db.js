"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
const connectDB = async () => {
    console.log("MONGODB_URI " + config_1.MONGODB_URI);
    try {
        await mongoose_1.default.connect(config_1.MONGODB_URI);
        console.log("MongoDB is connected");
    }
    catch (error) {
        console.error(error);
    }
};
exports.connectDB = connectDB;
const disconnectDB = async () => {
    try {
        await mongoose_1.default.disconnect();
    }
    catch (error) {
        console.error(error);
    }
};
exports.disconnectDB = disconnectDB;
