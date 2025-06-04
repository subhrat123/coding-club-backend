import {Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import config from "../configs/env"; // Adjust path if needed

export interface JwtPayload {
  userId: string;
  // Add additional fields as necessary
}

export const authMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  
  if (!authHeader) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  // Expect token in the format "Bearer <token>"
  const token = authHeader.split(" ")[1];
  console.log(token);
  
  if (!token) {
    res.status(401).json({ message: "Unauthorized: Invalid token format" });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    // Attach decoded token data to the request object
    (req as any).user = decoded;
    console.log(decoded);
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(403).json({ message: "Invalid token" });
  }
};
