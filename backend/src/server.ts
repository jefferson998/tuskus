import express,{Application} from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PORT } from "./config";

import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import taksRoutes from "./routes/tasks.routes";
import { FRONTEND_URL } from "./config.js";
import { connectDB } from "./db";

const app: Application = express();
dotenv.config();

// app.use(
//   cors({
//     credentials: true,
//     origin: FRONTEND_URL,
//   })
// );
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api", taksRoutes);

// if (process.env.NODE_ENV === "production") {
//   const path = await import("path");
//   app.use(express.static("client/dist"));

//   app.get("*", (req, res) => {
//     console.log(path.resolve("client", "dist", "index.html") );
//     res.sendFile(path.resolve("client", "dist", "index.html"));
//   });
// }

export async function mainDB() {
    try {
      await connectDB().catch(console.dir);
      app.listen(PORT);
      console.log(`Listening on port http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`)
    } catch (error) {
      console.error(error);
    }
  }

mainDB()

export default app;