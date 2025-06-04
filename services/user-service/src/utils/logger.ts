import winston from "winston";
import expressWinston from "express-winston";

// Define the log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} ${level}: ${message}`;
  })
);

// Create the winston logger instance
const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    // Log to console (can add more transports like file, remote servers, etc.)
    new winston.transports.Console(),
  ],
});

// Create middleware for logging HTTP requests in Express
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console(),
  ],
  format: logFormat,
  meta: true, // Optionally include metadata (like HTTP request body)
  expressFormat: true, // Use default Express formatting
  colorize: true, // Colorize the output
});

// Custom log levels (optional)
const logInfo = (message: string) => {
  logger.info(message);
};

const logError = (message: string) => {
  logger.error(message);
};

const logWarn = (message: string) => {
  logger.warn(message);
};

export { logger, requestLogger, logInfo, logError, logWarn };
