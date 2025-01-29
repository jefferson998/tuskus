import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import taksRoutes from "./routes/tasks.routes";
import { connectDB } from "./db";

dotenv.config();

import { ENV, PORT, FRONTEND_URL } from "./config";

const app: Application = express();

const allowedOrigins = ["http://localhost:5173", FRONTEND_URL];

app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.options("*", cors());

// Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", taksRoutes);

export async function mainDB() {
  try {
    console.log("ENV:", ENV);
    await connectDB().catch(console.dir);
    app.listen(PORT, () => {
      console.log(`✅ Server running at: http://localhost:${PORT}`);
      console.log(`🌎 Environment: ${ENV}`);
    });
  } catch (error) {
    console.error("❌ Error starting the server:", error);
  }
}

mainDB();

export default app;
