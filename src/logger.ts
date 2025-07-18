// logger.ts
import winston from 'winston';

// Create a logger instance
const logger = winston.createLogger({
  level: 'info', // minimum level to log (e.g., info, error, warn, debug)
  format: winston.format.combine(
    winston.format.timestamp(), // adds timestamp
    winston.format.simple()     // simple text format
  ),
  transports: [
    new winston.transports.Console(), // show logs in terminal
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // save error logs to file
    new winston.transports.File({ filename: 'logs/combined.log' }) // save all logs to file
  ]
});

export default logger;
