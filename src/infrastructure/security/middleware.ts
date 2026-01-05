import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { createLogger } from '../../shared/utils';
import { SecurityConfig } from '../../shared/types';

const logger = createLogger('security-middleware');

export class SecurityMiddleware {
  private config: SecurityConfig;

  constructor(config: SecurityConfig) {
    this.config = config;
  }

  // API Key Authentication Middleware
  apiKeyAuth = (req: Request, res: Response, next: NextFunction): void => {
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
      logger.warn('API key missing in request');
      res.status(401).json({
        success: false,
        error: 'API key required',
        timestamp: new Date()
      });
      return;
    }

    if (apiKey !== this.config.apiKey) {
      logger.warn('Invalid API key provided');
      res.status(403).json({
        success: false,
        error: 'Invalid API key',
        timestamp: new Date()
      });
      return;
    }

    next();
  };

  // JWT Authentication Middleware (for future use)
  jwtAuth = (req: Request, res: Response, next: NextFunction): void => {
    // Placeholder for JWT authentication
    // const token = req.headers.authorization?.replace('Bearer ', '');
    // Implement JWT verification logic here
    next();
  };

  // Request Logging Middleware
  requestLogger = (req: Request, res: Response, next: NextFunction): void => {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    });

    next();
  };

  // CORS Middleware (enhanced)
  corsHandler = (req: Request, res: Response, next: NextFunction): void => {
    const origin = req.headers.origin as string;

    if (this.config.corsOrigins.includes('*') || this.config.corsOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin || '*');
    }

    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-api-key');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }

    next();
  };

  // Input Sanitization Middleware
  sanitizeInput = (req: Request, res: Response, next: NextFunction): void => {
    // Basic input sanitization
    const sanitizeString = (str: string): string => {
      return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    };

    const sanitizeObject = (obj: any): any => {
      if (typeof obj === 'string') {
        return sanitizeString(obj);
      }
      if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
      }
      if (obj && typeof obj === 'object') {
        const sanitized: any = {};
        for (const [key, value] of Object.entries(obj)) {
          sanitized[key] = sanitizeObject(value);
        }
        return sanitized;
      }
      return obj;
    };

    if (req.body) {
      req.body = sanitizeObject(req.body);
    }
    if (req.query) {
      req.query = sanitizeObject(req.query);
    }

    next();
  };

  // Security Headers Middleware
  securityHeaders = (req: Request, res: Response, next: NextFunction): void => {
    // Additional security headers beyond Helmet
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

    next();
  };

  // Rate Limiting Middleware
  createRateLimiter = () => {
    return rateLimit({
      windowMs: this.config.rateLimits.windowMs,
      max: this.config.rateLimits.maxRequests,
      message: {
        success: false,
        error: 'Too many requests, please try again later',
        timestamp: new Date()
      },
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req: Request, res: Response) => {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
          success: false,
          error: 'Too many requests, please try again later',
          timestamp: new Date()
        });
      }
    });
  };

  // IP Whitelisting Middleware (optional)
  ipWhitelist = (allowedIPs: string[] = []) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (allowedIPs.length === 0) {
        next();
        return;
      }

      const clientIP = req.ip || req.connection.remoteAddress || '';

      if (!allowedIPs.includes(clientIP)) {
        logger.warn(`Blocked request from unauthorized IP: ${clientIP}`);
        res.status(403).json({
          success: false,
          error: 'Access denied',
          timestamp: new Date()
        });
        return;
      }

      next();
    };
  };

  // Request Size Limiting Middleware
  requestSizeLimit = (maxSize: string = '10mb') => {
    return (req: Request, res: Response, next: NextFunction): void => {
      const contentLength = parseInt(req.headers['content-length'] || '0');

      if (contentLength > this.parseSize(maxSize)) {
        logger.warn(`Request size limit exceeded: ${contentLength} bytes`);
        res.status(413).json({
          success: false,
          error: 'Request entity too large',
          timestamp: new Date()
        });
        return;
      }

      next();
    };
  };

  private parseSize(size: string): number {
    const units: { [key: string]: number } = {
      'b': 1,
      'kb': 1024,
      'mb': 1024 * 1024,
      'gb': 1024 * 1024 * 1024
    };

    const match = size.toLowerCase().match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)?$/);
    if (!match) return 10 * 1024 * 1024; // Default 10MB

    const value = parseFloat(match[1]);
    const unit = match[2] || 'b';

    return value * units[unit];
  }
}
