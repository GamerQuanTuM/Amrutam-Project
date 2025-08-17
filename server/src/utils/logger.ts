// utils/logger.ts
import env from '../config/env.config';
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';

const isProduction = env.NODE_ENV === 'production';

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define log levels type
type LogLevel = 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly';

// Color mapping with proper typing
const colors: Record<LogLevel, string> = {
  error: '\x1b[31m',   // red
  warn: '\x1b[33m',    // yellow
  info: '\x1b[36m',    // cyan
  http: '\x1b[35m',    // magenta
  verbose: '\x1b[34m', // blue
  debug: '\x1b[32m',   // green
  silly: '\x1b[37m',   // white
};

// Icon mapping with proper typing
const icons: Record<LogLevel, string> = {
  error: '❌',
  warn: '⚠️ ',
  info: '💡',
  http: '🌐',
  verbose: '📝',
  debug: '🐛',
  silly: '🎭',
};

// Pretty format for console (development)
const prettyFormat = format.printf(({ timestamp, level, message, service, stack, ...meta }) => {
  const reset = '\x1b[0m';
  const bold = '\x1b[1m';
  const dim = '\x1b[2m';
  
  const logLevel = level.toLowerCase() as LogLevel;
  
  const icon = icons[logLevel] || '📋';
  const color = colors[logLevel] || colors.info;
  
  const timeStr = `${dim}${timestamp}${reset}`;
  const levelStr = `${color}${bold}${level.toUpperCase()}${reset}`;
  const serviceStr = service ? `${dim}[${service}]${reset}` : '';
  const messageStr = `${bold}${message}${reset}`;
  
  const metaStr = Object.keys(meta).length > 0 
    ? `\n   ${dim}${JSON.stringify(meta, null, 2)}${reset}` 
    : '';
  
  const stackStr = stack ? `\n   ${dim}${stack}${reset}` : '';
  
  return `${timeStr} ${icon} ${levelStr} ${serviceStr} ${messageStr}${metaStr}${stackStr}`;
});

// File format (structured JSON)
const fileFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.json()
);

// Console format (pretty in dev, JSON in prod)
const consoleFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.splat(),
  isProduction ? format.json() : prettyFormat
);

// Daily rotate file transport for all logs
const dailyRotateTransport = new DailyRotateFile({
  filename: path.join(logsDir, 'app-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  format: fileFormat,
  handleExceptions: true,
  handleRejections: true,
});

// Daily rotate file transport for errors only
const errorRotateTransport = new DailyRotateFile({
  filename: path.join(logsDir, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
  level: 'error',
  format: fileFormat,
  handleExceptions: true,
  handleRejections: true,
});

// Simple text file transport (if you prefer .txt format)
const simpleFileTransport = new transports.File({
  filename: path.join(logsDir, 'app.txt'),
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.printf(({ timestamp, level, message, service, requestId, ...meta }) => {
      const metaStr = Object.keys(meta).length > 0 ? ` | ${JSON.stringify(meta)}` : '';
      const reqIdStr = requestId ? ` [${requestId}]` : '';
      const serviceStr = service ? ` [${service}]` : '';
      return `${timestamp} ${level.toUpperCase()}${serviceStr}${reqIdStr}: ${message}${metaStr}`;
    })
  ),
  maxsize: 50 * 1024 * 1024, // 50MB
  maxFiles: 3,
});

// Create logger
const logger = createLogger({
  level: isProduction ? 'info' : 'debug',
  format: consoleFormat,
  defaultMeta: { service: 'amrutam-app-backend' },
  transports: [
    // Console output
    new transports.Console({
      handleExceptions: true,
      handleRejections: true,
      format: consoleFormat,
    }),
    // Daily rotating files (JSON format)
    dailyRotateTransport,
    errorRotateTransport,
    // Simple text file
    simpleFileTransport,
  ],
});

// Event listeners for file rotation
dailyRotateTransport.on('rotate', (oldFilename, newFilename) => {
  logger.info('Log file rotated', { oldFilename, newFilename });
});

errorRotateTransport.on('rotate', (oldFilename, newFilename) => {
  logger.info('Error log file rotated', { oldFilename, newFilename });
});

// Define extended logger interface
interface ExtendedLogger extends ReturnType<typeof createLogger> {
  extend: (meta: object) => {
    error: (message: string, ...args: any[]) => void;
    warn: (message: string, ...args: any[]) => void;
    info: (message: string, ...args: any[]) => void;
    http: (message: string, ...args: any[]) => void;
    verbose: (message: string, ...args: any[]) => void;
    debug: (message: string, ...args: any[]) => void;
    silly: (message: string, ...args: any[]) => void;
  };
}

// Add convenience methods for better DX
(logger as ExtendedLogger).extend = (meta: object) => {
  return {
    error: (message: string, ...args: any[]) => logger.error(message, { ...meta, ...args }),
    warn: (message: string, ...args: any[]) => logger.warn(message, { ...meta, ...args }),
    info: (message: string, ...args: any[]) => logger.info(message, { ...meta, ...args }),
    http: (message: string, ...args: any[]) => logger.http(message, { ...meta, ...args }),
    verbose: (message: string, ...args: any[]) => logger.verbose(message, { ...meta, ...args }),
    debug: (message: string, ...args: any[]) => logger.debug(message, { ...meta, ...args }),
    silly: (message: string, ...args: any[]) => logger.silly(message, { ...meta, ...args }),
  };
};

export default logger as ExtendedLogger;