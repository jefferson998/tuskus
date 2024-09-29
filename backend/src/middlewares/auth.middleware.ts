import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config";
import { Request, Response, NextFunction } from "express";

export const auth = (req: any, res: Response, next: NextFunction): void => {
  try {
    // console.log(req);
    // console.log(JSON.stringify(req.cookies));
    console.log(req.headers.token);
    
    const token = req.headers.token;

    console.log("this is token ",token);
    
    if (!token) {
      res.status(401).json({ message: "No token, authorization denied" });
      return; // Detenemos aquí el flujo
    }

    jwt.verify(token, TOKEN_SECRET, (error:any, user:any) => {
      if (error) {
        res.status(401).json({ message: "Token is not valid" });
        return; // Detenemos aquí el flujo
      }

      req.user = user as any; // Añadimos `user` al objeto `Request`
      next(); // Continuamos el flujo
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};