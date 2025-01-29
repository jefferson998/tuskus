import User from "../models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { TOKEN_SECRET } from "../config";
import { createAccessToken } from "../libs/jwt";
import { Request, Response } from "express";
import {ENV} from '../config'

export const register = async (req: Request, res: Response): Promise<void> => {
  console.log("🚀 ~ register ~ req:", req)
  try {
    const { username, email, password } = req.body;
    console.log("🚀 ~ register ~ username:", username)
    
    const userFound = await User.findOne({ email });

    if (userFound) {
      res.status(400).json({
        message: ["The email is already in use"],
      });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: passwordHash,
    });

    const userSaved = await newUser.save();

    const token = await createAccessToken({
      id: userSaved?._id.toString(),
    });

    res.cookie("token", token, {
      httpOnly: ENV !== "development",
      secure: true,
      sameSite: "none",
    });

    res.json({
      id: userSaved?._id,
      username: userSaved?.username,
      email: userSaved?.email,
      token:token
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const userFound = await User.findOne({ email });

    if (!userFound) {
      res.status(400).json({
        message: ["The email does not exist"],
      })
      return;
    }

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      res.status(400).json({
        message: ["The password is incorrect"],
      });
      return; 
    }

    const token = await createAccessToken({
      id: userFound?._id.toString(),  
      username: userFound?.username,
    });

    res.cookie("token", token, {
      httpOnly: ENV !== "development",
      secure: true,
      sameSite: "none",
    });
      
    res.json({
      id: userFound?._id,
      username: userFound?.username,
      email: userFound?.email,
      token:token
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyToken = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.cookies;

  if (!token) {
    res.status(401).json({ message: "No token provided" });
  }

  try {
    if (!TOKEN_SECRET) {
      throw new Error("Server error, please try again");
    }
    const user = jwt.verify(token, TOKEN_SECRET) as unknown as { id: string };

    const userFound = await User.findById(user.id);
    if (!userFound) {
     res.status(401).json({ message: "User not found" });
    }

    res.json({
      id: userFound?._id,
      username: userFound?.username,
      email: userFound?.email,
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const logout = async (req:any, res:any) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

export const example = (req: Request, res: Response): void => {
  res.status(200).json({ message: "Hello Tuskus world" });
};