const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const redis = require('redis');
const winston = require('winston');
const aiService = require('./aiService');
const blockchainService = require('./blockchain');
const Strategy = require('./models/Strategy');
const Trade = require('./models/Trade');
const { 
  securityHeaders, 
  apiLimiter, 
  strictLimiter, 
  flashLoanLimiter, 
  validateInput, 
  sanitizeInput, 
  securityLogger, 
  corsOptions, 
  authenticateApiKey 
} = require('./middleware/security');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware (applied first)
app.use(securityHeaders);
app.use(require('cors')(corsOptions));
app.use(securityLogger);
app.use(sanitizeInput);
app.use(express.json({ limit: '10mb' }));

// Rate limiting
app.use('/api/', apiLimiter);

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/arbitrage', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => logger.info('MongoDB connected'))
.catch(err => logger.error('MongoDB connection error:', err));

// Initialize services
async function initializeServices() {
  try {
    await aiService.initialize();
    await blockchainService.initialize('ETH'); // Default to Ethereum
    logger.info('All services initialized successfully');
  } catch (error) {
    logger.error('Service initialization failed:', error);
  }
}

initializeServices();

// Health check endpoint (no auth required)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Enterprise Arbitrage Flash Loan Backend is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Key authentication for all /api routes (except health)
app.use('/api', (req, res, next) => {
  if (req.path === '/health') return next();
  return authenticateApiKey(req, res, next);
});

// Strategy routes
app.get('/api/strategies', async (req, res) => {
  try {
    const { limit = 10, chain = 'ETH' } = req.query;
    const strategies = await Strategy.findTopPerformers(parseInt(limit));
    res.json({ strategies });
  } catch (error) {
    logger.error('Error fetching strategies:', error);
    res.status(500).json({ error: 'Failed to fetch strategies' });
  }
});

app.get('/api/strategies/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const strategy = await Strategy.findOne({ walletAddress });
    if (!strategy) {
      return res.status(404).json({ error: 'Strategy not found' });
    }
    res.json({ strategy });
  } catch (error) {
    logger.error('Error fetching strategy:', error);
    res.status(500).json({ error: 'Failed to fetch strategy' });
  }
});

app.post('/api/strategies/analyze', async (req, res) => {
  try {
    const { walletAddress, chain = 'ETH' } = req.body;

    // Check cache first
    const cached = await redisClient.get(`strategy:${walletAddress}`);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // Analyze wallet
    const analysis = await aiService.analyzeWallet(walletAddress, chain);

    // Save to database
    const strategy = new Strategy({
      walletAddress,
      ...analysis,
      chain,
      status: 'VERIFIED'
    });
    await strategy.save();

    // Cache result
    await redisClient.setEx(`strategy:${walletAddress}`, 3600, JSON.stringify(analysis)); // 1 hour cache

    res.json(analysis);
  } catch (error) {
    logger.error('Error analyzing wallet:', error);
    res.status(500).json({ error: 'Failed to analyze wallet' });
  }
});

// Trade routes
app.get('/api/trades', async (req, res) => {
  try {
    const { walletAddress, limit = 50 } = req.query;
    const trades = await Trade.findByWallet(walletAddress, parseInt(limit));
    res.json({ trades });
  } catch (error) {
    logger.error('Error fetching trades:', error);
    res.status(500).json({ error: 'Failed to fetch trades' });
  }
});

app.get('/api/trades/statistics', async (req, res) => {
  try {
    const { walletAddress, days = 30 } = req.query;
    const stats = await Trade.getStatistics(walletAddress, parseInt(days));
    res.json({ statistics: stats[0] || {} });
  } catch (error) {
    logger.error('Error fetching trade statistics:', error);
    res.status(500).json({ error: 'Failed to fetch trade statistics' });
  }
});

// Flash loan execution (most restricted)
app.post('/api/execute-flash-loan', flashLoanLimiter, validateInput, async (req, res) => {
  try {
    const {
      strategyId,
      tokenIn,
      tokenOut,
      amount,
      dexPath,
      slippageTolerance = 0.005
    } = req.body;

    // Validate arbitrage opportunity
    const isValidOpportunity = await blockchainService.validateArbitrageOpportunity(tokenIn, tokenOut, amount);
    if (!isValidOpportunity) {
      return res.status(400).json({ error: 'No profitable arbitrage opportunity found' });
    }

    // Execute flash loan
    const result = await blockchainService.executeFlashLoanArbitrage({
      tokenIn,
      tokenOut,
      amount,
      dexPath,
      slippageTolerance
    });

    if (result.success) {
      // Record trade
      const trade = new Trade({
        tradeId: result.transactionHash,
        strategyId,
        walletAddress: await blockchainService.signer.getAddress(),
        type: 'FLASH_LOAN_ARBITRAGE',
        status: 'COMPLETED',
        amount,
        tokenIn,
        tokenOut,
        dexPath,
        profit: { actual: result.profit.toString() },
        transactionHash: result.transactionHash,
        blockNumber: result.blockNumber,
        gasUsed: result.gasUsed,
        executionTime: 0 // Would be calculated from tx timestamps
      });
      await trade.save();

      // Update strategy performance
      const strategy = await Strategy.findById(strategyId);
      if (strategy) {
        await strategy.updatePerformance({ success: true });
      }
    }

    res.json(result);
  } catch (error) {
    logger.error('Error executing flash loan:', error);
    res.status(500).json({ error: 'Failed to execute flash loan' });
  }
});

// Wallet mirroring
app.post('/api/mirror-wallet', async (req, res) => {
  try {
    const { sourceWallet, targetWallet, strategyId } = req.body;

    // Analyze source wallet if not already analyzed
    let strategy = await Strategy.findOne({ walletAddress: sourceWallet });
    if (!strategy) {
      const analysis = await aiService.analyzeWallet(sourceWallet);
      strategy = new Strategy({
        walletAddress: sourceWallet,
        ...analysis,
        status: 'VERIFIED'
      });
      await strategy.save();
    }

    // Optimize strategy for current market conditions
    const marketConditions = {
      gasPrice: await blockchainService.getGasPrice(),
      // Add more market data...
    };

    const optimizedStrategy = await aiService.optimizeStrategy(strategy.toObject(), marketConditions);

    // Execute mirrored trade
    const result = await blockchainService.executeFlashLoanArbitrage(optimizedStrategy);

    if (result.success) {
      // Record mirrored trade
      const trade = new Trade({
        tradeId: result.transactionHash,
        strategyId: strategy._id,
        walletAddress: targetWallet || await blockchainService.signer.getAddress(),
        type: 'FLASH_LOAN_ARBITRAGE',
        status: 'COMPLETED',
        amount: optimizedStrategy.flashLoanAmount,
        tokenIn: 'ETH', // Example
        tokenOut: 'USDC', // Example
        dexPath: optimizedStrategy.dexPath,
        profit: { actual: result.profit.toString() },
        transactionHash: result.transactionHash,
        blockNumber: result.blockNumber,
        gasUsed: result.gasUsed,
        copiedFrom: {
          wallet: sourceWallet,
          strategy: strategy.label,
          timestamp: new Date()
        }
      });
      await trade.save();
    }

    res.json({
      success: result.success,
      strategy: optimizedStrategy,
      execution: result
    });
  } catch (error) {
    logger.error('Error mirroring wallet:', error);
    res.status(500).json({ error: 'Failed to mirror wallet' });
  }
});

// Token security audit
app.post('/api/audit-token', strictLimiter, validateInput, async (req, res) => {
  try {
    const { tokenAddress, chain = 'ETH' } = req.body;
    const audit = await aiService.auditTokenSecurity(tokenAddress, chain);
    res.json(audit);
  } catch (error) {
    logger.error('Error auditing token:', error);
    res.status(500).json({ error: 'Failed to audit token' });
  }
});

// Blockchain info
app.get('/api/blockchain/balance/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const balance = await blockchainService.getBalance(address);
    res.json({ balance });
  } catch (error) {
    logger.error('Error fetching balance:', error);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

app.get('/api/blockchain/gas-price', async (req, res) => {
  try {
    const gasPrice = await blockchainService.getGasPrice();
    res.json({ gasPrice });
  } catch (error) {
    logger.error('Error fetching gas price:', error);
    res.status(500).json({ error: 'Failed to fetch gas price' });
  }
});

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = app;
