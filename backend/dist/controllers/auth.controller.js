"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.example = exports.logout = exports.verifyToken = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = require("../config");
const jwt_1 = require("../libs/jwt");
const config_2 = require("../config");
const register = async (req, res) => {
    console.log("🚀 ~ register ~ req:", req);
    try {
        const { username, email, password } = req.body;
        console.log("🚀 ~ register ~ username:", username);
        const userFound = await user_model_1.default.findOne({ email });
        if (userFound) {
            res.status(400).json({
                message: ["The email is already in use"],
            });
            return; // Asegúrate de salir después de enviar la respuesta
        }
        // Hashing the password
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        // Creating the user
        const newUser = new user_model_1.default({
            username,
            email,
            password: passwordHash,
        });
        // Saving the user in the database
        const userSaved = await newUser.save();
        // Create access token
        const token = await (0, jwt_1.createAccessToken)({
            id: userSaved?._id.toString(),
        });
        res.cookie("token", token, {
            httpOnly: config_2.ENV !== "development",
            secure: true,
            sameSite: "none",
        });
        res.json({
            id: userSaved?._id,
            username: userSaved?.username,
            email: userSaved?.email,
            token: token
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userFound = await user_model_1.default.findOne({ email });
        if (!userFound) {
            res.status(400).json({
                message: ["The email does not exist"],
            });
            return; // Salir después de enviar la respuesta
        }
        const isMatch = await bcryptjs_1.default.compare(password, userFound.password);
        if (!isMatch) {
            res.status(400).json({
                message: ["The password is incorrect"],
            });
            return; // Salir después de enviar la respuesta
        }
        const token = await (0, jwt_1.createAccessToken)({
            id: userFound?._id.toString(), // Convertir a string si es necesario
            username: userFound?.username,
        });
        res.cookie("token", token, {
            httpOnly: config_2.ENV !== "development",
            secure: true,
            sameSite: "none",
        });
        res.json({
            id: userFound?._id,
            username: userFound?.username,
            email: userFound?.email,
            token: token
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.login = login;
const verifyToken = async (req, res) => {
    const { token } = req.cookies;
    // Verificar si hay un token
    if (!token) {
        res.status(401).json({ message: "No token provided" });
    }
    // Verificar el token
    try {
        if (!config_1.TOKEN_SECRET) {
            throw new Error("Server error, please try again");
        }
        const user = jsonwebtoken_1.default.verify(token, config_1.TOKEN_SECRET);
        // Buscar el usuario en la base de datos
        const userFound = await user_model_1.default.findById(user.id);
        if (!userFound) {
            res.status(401).json({ message: "User not found" });
        }
        // Retornar información del usuario
        res.json({
            id: userFound?._id,
            username: userFound?.username,
            email: userFound?.email,
        });
    }
    catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};
exports.verifyToken = verifyToken;
const logout = async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        secure: true,
        expires: new Date(0),
    });
    return res.sendStatus(200);
};
exports.logout = logout;
const example = (req, res) => {
    res.status(200).json({ message: "Hello Tuskus world" });
};
exports.example = example;
