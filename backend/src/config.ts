export const PORT = process.env.PORT || 4000;
export const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb+srv://fitkro:lQ87dPzG6DCWUbwX@tuskusapi.dahkp.mongodb.net/tuskus?retryWrites=true&w=majority&appName=tuskusapi";
export const TOKEN_SECRET = process.env.JWT_SECRET || "secret";

export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";