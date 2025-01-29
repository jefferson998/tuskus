"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSchema = void 0;
const validateSchema = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    }
    catch (error) {
        const errorMessages = error.errors.map((err) => err.message);
        res.status(400).json({ message: errorMessages });
    }
};
exports.validateSchema = validateSchema;
