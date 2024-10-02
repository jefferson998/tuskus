import express,{Application} from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ENV, PORT,FRONTEND_URL } from "./config";

import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import taksRoutes from "./routes/tasks.routes";
import { connectDB } from "./db";

const app: Application = express();
dotenv.config();

if(ENV === 'prod'){
  app.use(
    cors({
      credentials: true,
      origin: FRONTEND_URL,
    })
  );
}




app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api", taksRoutes);


export async function mainDB() {
    try {
      console.log("ENV :: "+ENV);
      
      await connectDB().catch(console.dir);
      app.listen(PORT);
      console.log(`Listening on port http://localhost:${PORT}`);
      console.log(`Environment: ${ENV}`)
    } catch (error) {
      console.error(error);
    }
  }

mainDB()

export default app;