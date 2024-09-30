"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSchema = void 0;
const validateSchema = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body); // Validate request body
        next(); // Proceed if validation succeeds
    }
    catch (error) {
        // Handle validation errors
        const errorMessages = error.errors.map((err) => err.message);
        res.status(400).json({ message: errorMessages }); // Send error response with detailed message(s)
    }
};
exports.validateSchema = validateSchema;
//# sourceMappingURL=validator.middleware.js.map