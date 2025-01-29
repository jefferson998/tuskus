import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config";
import { Request, Response, NextFunction } from "express";

export const auth = (req: any, res: Response, next: NextFunction): void => {
  try {
    console.log(JSON.stringify(req.cookies));
    console.log(req.headers.token);
    
    const token = req.headers.token;

    console.log("this is token ",token);
    
    if (!token) {
      res.status(401).json({ message: "No token, authorization denied" });
      return; 
    }
    if (!TOKEN_SECRET) {
      throw new Error("Server error, please try again");
    }
    jwt.verify(token, TOKEN_SECRET, (error:any, user:any) => {
      if (error) {
        res.status(401).json({ message: "Token is not valid" });
        return;
      }

      req.user = user as any;
      next();
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};