"use strict";
// import mongoose from "mongoose";
// import { MONGODB_URI } from "./config.js";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
// export const connectDB = async () => {
//   try {
//     await mongoose.connect(MONGODB_URI);
//     console.log("MongoDB is connected");
//   } catch (error) {
//     console.error(error);
//   }
// };
// import { MongoClient, ServerApiVersion } from 'mongodb';
// import {MONGODB_URI} from "./config.js"
// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(MONGODB_URI, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });
// export async function connectDB() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// // connectDB().catch(console.dir);
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(config_1.MONGODB_URI);
        console.log("MongoDB is connected");
    }
    catch (error) {
        console.error(error);
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=db.js.map