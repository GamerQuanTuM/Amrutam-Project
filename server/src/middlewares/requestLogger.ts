// middlewares/requestLogger.ts
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import logger from '../utils/logger';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      requestId: string;
      logger: ReturnType<typeof logger.extend>;
    }
  }
}

export const requestLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Generate unique request ID
  const requestId = randomUUID();
  
  // Attach to request object
  req.requestId = requestId;
  
  // Create a request-specific logger with context
  req.logger = logger.extend({
    requestId,
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip || req.connection.remoteAddress,
  });
  
  // Add to response headers (optional - useful for debugging)
  res.setHeader('X-Request-ID', requestId);
  
  // Log incoming request
  req.logger.info('Request started', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
  });
  
  // Log response when request ends
  const originalSend = res.send;
  res.send = function(data) {
    req.logger.info('Request completed', {
      statusCode: res.statusCode,
      responseTime: `${Date.now() - (req as any).startTime}ms`,
    });
    return originalSend.call(this, data);
  };
  
  // Add start time for response time calculation
  (req as any).startTime = Date.now();
  
  next();
};
