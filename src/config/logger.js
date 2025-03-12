const winston = require("winston");
const { combine, timestamp, errors, splat, json, colorize, printf } =
  winston.format;

// Define a custom format for the console output that is human-friendly.
const customFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  let logMessage = `${timestamp} [${level}]: ${stack || message}`;
  if (Object.keys(meta).length) {
    logMessage += ` ${JSON.stringify(meta)}`;
  }
  return logMessage;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  defaultMeta: { service: "user-service" },
  // Default logging format for file transports (structured JSON)
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    splat(),
    json()
  ),
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        errors({ stack: true }),
        splat(),
        customFormat
      ),
    }),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: "logs/exceptions.log" }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: "logs/rejections.log" }),
  ],
});

module.exports = logger;
