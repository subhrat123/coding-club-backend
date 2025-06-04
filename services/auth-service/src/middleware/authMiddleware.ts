import { RequestHandler, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/env"; 
import { logInfo, logError } from "../utils/logger"; // Import logger

export interface JwtPayload {
  userId: string;
}


export const authMiddleware: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    logError("Unauthorized access attempt (No token provided)");
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    logError("Unauthorized access attempt (Invalid token format)");
    res.status(401).json({ message: "Unauthorized: Invalid token format" });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    (req as any).user = decoded;
    logInfo(`Authenticated user: ${decoded.userId}`);
    next();
  } catch (error) {
    logError(`Token verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(403).json({ message: "Invalid token" });
  }
};

