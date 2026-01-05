const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const validator = require('validator');
const crypto = require('crypto');

// Rate limiting configurations
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000, // Increased for real-time dashboard polling (Matrix, Bots, Stats)
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Increased for frequent strategy updates
  message: {
    error: 'Too many sensitive operations from this IP, please try again later.',
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const flashLoanLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 flash loan requests per minute
  message: {
    error: 'Flash loan rate limit exceeded. Maximum 5 requests per minute.',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Security headers
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);

    const allowedOrigins = process.env.ALLOWED_ORIGINS ?
      process.env.ALLOWED_ORIGINS.split(',') :
      ['http://localhost:3000', 'http://localhost:3001'];

    // Wildcard support for easier initial config
    if (allowedOrigins.includes('*')) return callback(null, true);

    const isAllowed = allowedOrigins.some(allowed => {
      // Handle trailing slashes in both definition and origin
      const normalizedAllowed = allowed.replace(/\/$/, "");
      const normalizedOrigin = origin.replace(/\/$/, "");
      return normalizedOrigin === normalizedAllowed;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`CORS Blocked: ${origin}`);
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Input validation middleware
const validateInput = (req, res, next) => {
  const errors = [];

  // Validate wallet addresses
  if (req.body.address && !validator.isEthereumAddress(req.body.address)) {
    errors.push('Invalid Ethereum address format');
  }

  if (req.body.tokenAddress && !validator.isEthereumAddress(req.body.tokenAddress)) {
    errors.push('Invalid token address format');
  }

  if (req.body.sourceWallet && !validator.isEthereumAddress(req.body.sourceWallet)) {
    errors.push('Invalid source wallet address format');
  }

  if (req.body.targetWallet && !validator.isEthereumAddress(req.body.targetWallet)) {
    errors.push('Invalid target wallet address format');
  }

  if (req.body.multiSigAddress && !validator.isEthereumAddress(req.body.multiSigAddress)) {
    errors.push('Invalid multi-sig address format');
  }

  // Validate amounts (must be positive numbers)
  if (req.body.amount && (!validator.isFloat(req.body.amount.toString()) || req.body.amount <= 0)) {
    errors.push('Amount must be a positive number');
  }

  if (req.body.value && (!validator.isFloat(req.body.value.toString()) || req.body.value < 0)) {
    errors.push('Value must be a non-negative number');
  }

  // Validate slippage tolerance (0-1 range)
  if (req.body.slippageTolerance !== undefined) {
    const slippage = parseFloat(req.body.slippageTolerance);
    if (isNaN(slippage) || slippage < 0 || slippage > 1) {
      errors.push('Slippage tolerance must be between 0 and 1');
    }
  }

  // Validate required confirmations
  if (req.body.requiredConfirmations && (!Number.isInteger(req.body.requiredConfirmations) || req.body.requiredConfirmations <= 0)) {
    errors.push('Required confirmations must be a positive integer');
  }

  // Validate owners array
  if (req.body.owners && (!Array.isArray(req.body.owners) || req.body.owners.length === 0)) {
    errors.push('Owners must be a non-empty array');
  }

  if (req.body.owners) {
    req.body.owners.forEach((owner, index) => {
      if (!validator.isEthereumAddress(owner)) {
        errors.push(`Invalid owner address at index ${index}`);
      }
    });
  }

  // Validate strategy data
  if (req.body.dexPath && !Array.isArray(req.body.dexPath)) {
    errors.push('DEX path must be an array');
  }

  if (req.body.dexPath) {
    req.body.dexPath.forEach((dex, index) => {
      if (!['UNISWAP', 'SUSHISWAP', 'PANCAKESWAP', 'RAYDIUM', 'ORCA', 'JUPITER'].includes(dex)) {
        errors.push(`Invalid DEX at index ${index}`);
      }
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors,
      timestamp: new Date().toISOString()
    });
  }

  next();
};

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
  // Recursively sanitize all string inputs
  const sanitizeObject = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        // Remove potentially dangerous characters
        obj[key] = validator.escape(obj[key]);
        // Trim whitespace
        obj[key] = obj[key].trim();
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key]);
      }
    }
  };

  if (req.body) {
    sanitizeObject(req.body);
  }

  if (req.query) {
    sanitizeObject(req.query);
  }

  next();
};

// Security logging middleware
const securityLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent') || 'Unknown';

  console.log(`[${timestamp}] SECURITY: ${req.method} ${req.path} - IP: ${ip} - UA: ${userAgent}`);

  // Log sensitive operations
  if (['POST', 'PUT', 'DELETE'].includes(req.method) && req.path.includes('/api/')) {
    console.log(`[${timestamp}] SENSITIVE: ${req.method} ${req.path} - Body: ${JSON.stringify(req.body)}`);
  }

  next();
};

// API Key authentication middleware
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');

  if (!apiKey) {
    return res.status(401).json({
      error: 'API key required',
      message: 'Please provide an API key in x-api-key header or Authorization header',
      timestamp: new Date().toISOString()
    });
  }

  // In production, verify against database or secure storage
  const validApiKeys = process.env.API_KEYS ? process.env.API_KEYS.split(',') : ['dev-api-key-12345'];

  if (!validApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: 'Invalid API key',
      message: 'The provided API key is not valid',
      timestamp: new Date().toISOString()
    });
  }

  // Add API key info to request for logging
  req.apiKey = apiKey;
  next();
};

module.exports = {
  apiLimiter,
  strictLimiter,
  flashLoanLimiter,
  validateInput,
  sanitizeInput,
  securityHeaders,
  corsOptions,
  securityLogger,
  authenticateApiKey
};
