"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaskSchema = void 0;
const zod_1 = require("zod");
exports.createTaskSchema = zod_1.z.object({
    title: zod_1.z.string({
        required_error: "Title is required",
    }),
    description: zod_1.z.string().optional(),
    progress: zod_1.z.string().optional(),
    date: zod_1.z.string().datetime().optional()
});
