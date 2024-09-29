import { NextFunction, Request, Response } from "express";

export const validateSchema = (schema: any) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body); // Validate request body
      next(); // Proceed if validation succeeds
    } catch (error: any) {
      // Handle validation errors
      const errorMessages = error.errors.map((err: { message: string }) => err.message);
      res.status(400).json({ message: errorMessages }); // Send error response with detailed message(s)
    }
  };