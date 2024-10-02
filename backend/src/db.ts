import mongoose from "mongoose";
import { MONGODB_URI } from "./config";

export const connectDB = async () => {
  console.log("MONGODB_URI "+MONGODB_URI);
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB is connected");
  } catch (error) {
    console.error(error);
  }
};


export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
  }
  
};
