import { NextFunction, Request, Response } from "express";

export const validateSchema = (schema: any) =>
  (req: Request, res: Response, next: NextFunction): void => {    
    try {
      schema.parse(req.body); 
      next(); 
    } catch (error: any) {
      const errorMessages = error.errors.map((err: { message: string }) => err.message);
      res.status(400).json({ message: errorMessages }); 
    }
  };