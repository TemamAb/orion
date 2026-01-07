// Import required modules
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const winston = require('winston');
const { StrategyForger } = require('../src/core/ai/specialists/StrategyForger');

// Import services
const aiService = require('./aiService');
const blockchainService = require('./blockchain');
const botOrchestrator = require('./botOrchestrator');

// Import middleware
const securityMiddleware = require('./middleware/security');

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'orion-backend' },
  transports: [
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

// Initialize StrategyForger
let strategyForger = null;

// Create Express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? (process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['https://your-frontend-domain.com'])
    : ['http://localhost:3000', 'http://localhost:5173'], // Allow local development
  credentials: true
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Apply security middleware
app.use(securityMiddleware);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Orion Backend is operational',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    services: {
      ai: aiService.isReady,
      blockchain: blockchainService.isConnected,
      botOrchestrator: botOrchestrator.isRunning,
      strategyForger: !!strategyForger
    },
    timestamp: new Date().toISOString()
  });
});

// Learning curve endpoints
app.get('/api/learning/metrics', (req, res) => {
  try {
    if (!strategyForger) {
      return res.status(503).json({
        error: 'StrategyForger not initialized',
        message: 'Learning metrics unavailable'
      });
    }

    const metrics = strategyForger.getLearningMetrics();
    res.json(metrics);
  } catch (error) {
    logger.error('Error fetching learning metrics:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch learning metrics'
    });
  }
});

app.get('/api/learning/history', (req, res) => {
  try {
    if (!strategyForger) {
      return res.status(503).json({
        error: 'StrategyForger not initialized',
        message: 'Learning history unavailable'
      });
    }

    const metrics = strategyForger.getLearningMetrics();
    res.json({
      historicalPerformance: metrics.historicalPerformance,
      profitDayProgression: metrics.profitDayProgression,
      strategyCombinations: metrics.strategyCombinations
    });
  } catch (error) {
    logger.error('Error fetching learning history:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch learning history'
    });
  }
});

app.get('/api/learning/performance', (req, res) => {
  try {
    if (!strategyForger) {
      return res.status(503).json({
        error: 'StrategyForger not initialized',
        message: 'Learning performance unavailable'
      });
    }

    const metrics = strategyForger.getLearningMetrics();
    res.json({
      totalIterations: metrics.totalIterations,
      discoveredStrategies: metrics.discoveredStrategies,
      perfectMatchScore: metrics.perfectMatchScore,
      confidenceScore: metrics.confidenceScore,
      learningRate: metrics.learningRate
    });
  } catch (error) {
    logger.error('Error fetching learning performance:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch learning performance'
    });
  }
});

// Matrix status endpoint (for dashboard integration)
app.get('/api/matrix/status', (req, res) => {
  // Mock matrix status for now - in production this would come from botOrchestrator
  const mockMatrixStatus = {
    systemTotalProjectedProfit: 1000000, // $1M target
    matrix: {
      'THE GHOST': { status: 'ACTIVE', score: 95.2 },
      'SLOT-0 SNIPER': { status: 'SCANNING', score: 87.8 },
      'BUNDLE MASTER': { status: 'STANDBY', score: 92.1 },
      'ATOMIC FLUX': { status: 'ACTIVE', score: 89.5 },
      'DARK RELAY': { status: 'SCANNING', score: 91.3 },
      'HIVE SYMMETRY': { status: 'STANDBY', score: 88.7 },
      'DISCOVERY HUNT': { status: 'ACTIVE', score: 94.6 }
    }
  };
  res.json(mockMatrixStatus);
});

// Bot status endpoint
app.get('/api/bots/status', (req, res) => {
  const botStatus = botOrchestrator.getSystemStatus();
  res.json(botStatus);
});

// Performance stats endpoint
app.get('/api/performance/stats', (req, res) => {
  // Mock performance stats - in production this would aggregate real data
  res.json({
    totalProfit: 245000, // Mock profit
    totalTrades: 1247,
    winRate: 87.3,
    avgProfitPerTrade: 196.5
  });
});

// Strategy analysis endpoint
app.post('/api/strategies/analyze', async (req, res) => {
  try {
    const { walletAddress, chain } = req.body;

    if (!walletAddress) {
      return res.status(400).json({
        error: 'Validation failed',
        details: ['Wallet address is required']
      });
    }

    const analysis = await aiService.analyzeWallet(walletAddress, chain);
    res.json(analysis);
  } catch (error) {
    logger.error('Strategy analysis failed:', error);
    res.status(500).json({
      error: 'Analysis failed',
      message: 'Unable to analyze wallet strategy'
    });
  }
});

// Token audit endpoint
app.post('/api/audit-token', async (req, res) => {
  try {
    const { tokenAddress, chain } = req.body;

    if (!tokenAddress) {
      return res.status(400).json({
        error: 'Validation failed',
        details: ['Token address is required']
      });
    }

    const audit = await aiService.auditTokenSecurity(tokenAddress, chain);
    res.json(audit);
  } catch (error) {
    logger.error('Token audit failed:', error);
    res.status(500).json({
      error: 'Audit failed',
      message: 'Unable to audit token security'
    });
  }
});

// Alpha scan endpoint
app.post('/api/scan/alpha', async (req, res) => {
  try {
    // Mock alpha scan results - in production this would perform real scanning
    const mockResults = {
      opportunities: [
        {
          type: 'Arbitrage Opportunity',
          profit: 2500,
          description: 'Cross-DEX price differential detected',
          confidence: 0.89
        },
        {
          type: 'MEV Opportunity',
          profit: 1800,
          description: 'Large pending transaction identified',
          confidence: 0.76
        }
      ],
      totalProfit: 4300,
      scanTimestamp: new Date().toISOString()
    };

    res.json(mockResults);
  } catch (error) {
    logger.error('Alpha scan failed:', error);
    res.status(500).json({
      error: 'Scan failed',
      message: 'Unable to perform alpha scan'
    });
  }
});

// Session authorization endpoint
app.post('/api/session/authorize', (req, res) => {
  try {
    // Mock authorization - in production this would handle real wallet authorization
    res.json({
      success: true,
      message: 'Session authorized',
      sessionId: `session-${Date.now()}`
    });
  } catch (error) {
    logger.error('Session authorization failed:', error);
    res.status(500).json({
      error: 'Authorization failed',
      message: 'Unable to authorize session'
    });
  }
});

// Withdrawal execution endpoint
app.post('/api/withdrawal/execute', (req, res) => {
  try {
    // Mock withdrawal - in production this would execute real blockchain transactions
    res.json({
      success: true,
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      amount: 2452.84,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Withdrawal execution failed:', error);
    res.status(500).json({
      error: 'Withdrawal failed',
      message: 'Unable to execute withdrawal'
    });
  }
});

// Mirror wallet endpoint
app.post('/api/mirror-wallet', (req, res) => {
  try {
    // Mock wallet mirroring - in production this would set up real mirroring
    res.json({
      success: true,
      strategy: {
        id: `mirror-${Date.now()}`,
        sourceWallet: req.body.sourceWallet,
        targetWallet: req.body.targetWallet,
        status: 'ACTIVE'
      },
      execution: {
        initialSync: true,
        transactionsMirrored: 0
      }
    });
  } catch (error) {
    logger.error('Wallet mirroring failed:', error);
    res.status(500).json({
      error: 'Mirroring failed',
      message: 'Unable to set up wallet mirroring'
    });
  }
});

// Flash loan execution endpoint
app.post('/api/execute-flash-loan', (req, res) => {
  try {
    // Mock flash loan execution - in production this would execute real flash loans
    const { strategyId, tokenIn, tokenOut, amount, dexPath, slippageTolerance } = req.body;

    // Validate required fields
    if (!strategyId || !tokenIn || !tokenOut || !amount) {
      return res.status(400).json({
        error: 'Validation failed',
        details: ['strategyId, tokenIn, tokenOut, and amount are required']
      });
    }

    res.json({
      success: true,
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      profit: Math.floor(amount * 0.025), // 2.5% profit
      gasUsed: 250000,
      executionTime: Date.now()
    });
  } catch (error) {
    logger.error('Flash loan execution failed:', error);
    res.status(500).json({
      error: 'Execution failed',
      message: 'Unable to execute flash loan'
    });
  }
});

// Blockchain info endpoints
app.get('/api/blockchain/gas-price', async (req, res) => {
  try {
    const gasPrice = await blockchainService.getGasPrice();
    res.json({ gasPrice });
  } catch (error) {
    logger.error('Gas price fetch failed:', error);
    res.status(500).json({
      error: 'Gas price unavailable',
      message: 'Unable to fetch current gas price'
    });
  }
});

app.get('/api/blockchain/balance/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const balance = await blockchainService.getBalance(address);
    res.json({ balance });
  } catch (error) {
    logger.error('Balance fetch failed:', error);
    res.status(500).json({
      error: 'Balance unavailable',
      message: 'Unable to fetch wallet balance'
    });
  }
});

// Trade routes
app.get('/api/trades', (req, res) => {
  // Mock trades data - in production this would query database
  const mockTrades = [];
  res.json({ trades: mockTrades });
});

app.get('/api/trades/statistics', (req, res) => {
  // Mock trade statistics - in production this would aggregate from database
  const mockStats = {
    totalTrades: 0,
    totalVolume: 0,
    winRate: 0,
    avgProfit: 0
  };
  res.json({ statistics: mockStats });
});

// Strategy routes
app.get('/api/strategies', (req, res) => {
  // Mock strategies data - in production this would query database
  const mockStrategies = [];
  res.json({ strategies: mockStrategies });
});

app.get('/api/strategies/:walletAddress', (req, res) => {
  // Mock strategy lookup - in production this would query database
  res.status(404).json({
    error: 'Strategy not found',
    message: `No strategy found for wallet ${req.params.walletAddress}`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.originalUrl} not found`
  });
});

async function initializeServices() {
  // Validate critical API keys before initialization
  const requiredKeys = ['GEMINI_API_KEY', 'PIMLICO_API_KEY'];
  const missingKeys = requiredKeys.filter(key => !process.env[key] || process.env[key] === 'your_gemini_api_key_here' || process.env[key] === 'your_pimlico_api_key_here');

  if (missingKeys.length > 0) {
    logger.warn(`⚠️ WARNING: Missing or placeholder API keys detected: ${missingKeys.join(', ')}`);
    logger.warn('The server will start but some features may not work properly.');
    logger.warn('To get full functionality:');
    logger.warn('- Get GEMINI_API_KEY from: https://makersuite.google.com/app/apikey');
    logger.warn('- Get PIMLICO_API_KEY from: https://dashboard.pimlico.io/');
    logger.warn('Update these values in the .env file and restart the server.');
    // Don't exit - allow server to start for development/testing
  } else {
    logger.info('✅ API key validation passed');
  }

  try {
    await aiService.initialize();
    aiService.isReady = true;
    logger.info('AI service initialized successfully');
  } catch (error) {
    logger.error('AI service initialization failed:', error);
    logger.error('This may be due to invalid GEMINI_API_KEY or network issues');
    logger.warn('AI features will be disabled until API key is configured');
    // Don't exit - allow partial functionality
  }

  try {
    await blockchainService.initialize();
    blockchainService.isConnected = true;
    logger.info('Blockchain service initialized successfully');

    // Activate Tri-Tier Bot System
    botOrchestrator.start();
    logger.info('Tri-Tier Bot System activated');
  } catch (error) {
    logger.error('Blockchain service initialization failed:', error);
    logger.error('This may be due to invalid PIMLICO_API_KEY, RPC URLs, or network connectivity');
    logger.error('Available environment variables:', Object.keys(process.env).filter(key =>
      key.includes('API') || key.includes('RPC') || key.includes('POOL') || key.includes('ROUTER')
    ));
    logger.warn('Blockchain features will be limited until API keys are configured');
    // Don't exit - allow partial functionality but log prominently
  }

  // Initialize StrategyForger
  try {
    strategyForger = new StrategyForger(process.env.GEMINI_API_KEY);
    logger.info('StrategyForger initialized successfully');
  } catch (error) {
    logger.error('StrategyForger initialization failed:', error);
    // Don't exit - allow partial functionality
  }
}

// Initialize services and start server
async function startServer() {
  try {
    await initializeServices();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      logger.info(`🚀 Orion Backend Server running on port ${PORT}`);
      logger.info(`📊 Health check available at http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Export app for testing
module.exports = app;

// Start server if this file is run directly
if (require.main === module) {
  startServer();
}
