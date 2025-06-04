import { Request, Response, NextFunction } from "express";
import { logInfo } from "../utils/logger"; // Import logger

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  logInfo(`📡 [${req.method}] ${req.originalUrl}`); // Log every request
  next();
};

export default requestLogger;
