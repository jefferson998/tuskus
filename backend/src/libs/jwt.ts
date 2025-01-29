import jwt, { SignOptions } from "jsonwebtoken";
import { TOKEN_SECRET } from "../config";

interface JwtPayload {
  id: string;
  [key: string]: any; 
}

export async function createAccessToken(payload: JwtPayload): Promise<Object> {
  return new Promise((resolve, reject) => {
    const options: SignOptions = { expiresIn: "1d" };

    if (!TOKEN_SECRET) {
      return reject(new Error("Server error, please try again"));
    }

    jwt.sign(payload, TOKEN_SECRET, options, (err, token) => {
      if (err) return reject(err);
      resolve(token as string);
    });
  });
}