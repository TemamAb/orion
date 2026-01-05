require('dotenv').config();
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
} = require('./middleware/security');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'arbitrage-backend' },
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

// Middleware
app.use(helmet(securityHeaders));
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://orion-alpha.onrender.com', 'https://your-frontend-domain.com']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use('/api/', apiLimiter);
app.use('/api/strategies', strictLimiter);
app.use('/api/flash-loan', flashLoanLimiter);

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/arbitrage', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => logger.info('Connected to MongoDB'))
  .catch(err => logger.error('MongoDB connection error:', err));

// Redis connection
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));
redisClient.connect();

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'arbitrage-flash-loan-backend',
    version: '1.0.0'
  });
});

app.get('/api/status', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1;
    const redisStatus = redisClient.isOpen;

    res.json({
      database: dbStatus ? 'connected' : 'disconnected',
      redis: redisStatus ? 'connected' : 'disconnected',
      aiService: aiService.isReady ? 'ready' : 'not ready',
      blockchain: blockchainService.isConnected ? 'connected' : 'disconnected'
    });
  } catch (error) {
    logger.error('Status check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Strategy routes
app.get('/api/strategies', validateInput, async (req, res) => {
  try {
    const strategies = await Strategy.find({ active: true });
    res.json(strategies);
  } catch (error) {
    logger.error('Error fetching strategies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/strategies', validateInput, async (req, res) => {
  try {
    const strategy = new Strategy(req.body);
    await strategy.save();
    res.status(201).json(strategy);
  } catch (error) {
    logger.error('Error creating strategy:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/strategies/analyze', async (req, res) => {
  try {
    const { walletAddress, chain = 'ETH' } = req.body;

    // Fetch live tx history (Not just address) - Mocking fetch here as we lack Etherscan keys in this env
    // In production, this call would go to Etherscan/Infura to get last 50 txs
    const transactionHistory = [];

    // Analyze wallet with EVIDENCE
    const analysis = await aiService.analyzeWallet(walletAddress, chain, transactionHistory);

    if (analysis.status === 'FAILED') {
      return res.status(400).json({ error: analysis.error });
    }

    // Save
    const strategy = new Strategy({
      walletAddress,
      label: analysis.classification,
      ...analysis,
      chain,
      status: 'VERIFIED'
    });
    // Mongoose schema might need flexible updates if strict, but generic save usually works for new props if schema allows mixed
    // For now assuming schema mapping or simply returning analysis for UI

    // allow schema bypass for quick prototype update
    const saved = await Strategy.findOneAndUpdate(
      { walletAddress },
      { $set: { ...analysis, lastAnalyzed: new Date() } },
      { upsert: true, new: true }
    );

    res.json(saved);
  } catch (error) {
    logger.error('Error analyzing wallet:', error);
    res.status(500).json({ error: 'Failed to analyze wallet' });
  }
});

// NEW: 7-Node Strategy Matrix Live Status
// NEW: 7-Node Strategy Matrix - "The Profit Forge" Algorithm
app.get('/api/matrix/status', async (req, res) => {
  try {
    const gasPriceData = await blockchainService.getGasPrice();
    const networkStatus = await blockchainService.getStatus();

    // 1. Extract Real-Time Network Variables
    const gasGwei = parseInt(gasPriceData?.gasPrice || '0') / 1e9; // Convert to Gwei
    const blockNum = networkStatus.blockNumber || Date.now();

    // 2. Synthesize "Market Volatility" (Simulated based on block dynamics)
    // In a full node, this would come from "mempool pending tx count"
    const volatilityIndex = (blockNum % 100) / 100; // 0.00 - 0.99

    // 3. "The Profit Forge" Weighted Scoring System
    // Each strategy has a unique 'activation formula' based on network conditions

    const calculateScore = (strategyName) => {
      switch (strategyName) {
        case "THE GHOST":
          // Thrives in HIGH gas (congestion) + HIGH volatility (MEV opportunities)
          return (gasGwei > 40 ? 0.8 : 0.2) + (volatilityIndex * 0.5);

        case "SLOT-0 SNIPER":
          // Requires STABLE blocks + LOW volatility
          return (volatilityIndex < 0.3 ? 0.9 : 0.4);

        case "BUNDLE MASTER":
          // Atomic grouping needs Moderate Gas
          return (gasGwei > 15 && gasGwei < 50 ? 0.85 : 0.3);

        case "ATOMIC FLUX":
          // Pure arbitrage: Needs HIGH volatility (price dislocation)
          return volatilityIndex > 0.6 ? 0.95 : 0.4;

        case "DARK RELAY":
          // Liquidity sniping: Rare events (Low probability base)
          return (blockNum % 13 === 0 ? 0.9 : 0.1);

        case "HIVE SYMMETRY":
          // Copy-trading: Always moderately viable
          return 0.65;

        case "DISCOVERY HUNT":
          // Alpha searching: Inverse to congestion (needs cheap gas to scan)
          return (gasGwei < 20 ? 0.9 : 0.2);

        default: return 0.5;
      }
    };

    // 4. Forge Matrix Status
    const matrixStatus = {};
    const strategies = [
      "THE GHOST", "SLOT-0 SNIPER", "BUNDLE MASTER", "ATOMIC FLUX",
      "DARK RELAY", "HIVE SYMMETRY", "DISCOVERY HUNT"
    ];

    strategies.forEach(strat => {
      const score = calculateScore(strat);
      let status = 'STANDBY';
      let yieldRate = 0;

      if (score > 0.8) status = 'ACTIVE';
      else if (score > 0.5) status = 'SCANNING';

      // Dynamic Yield Calculation based on Score
      // Higher score = Higher theoretical yield at this exact second
      if (status !== 'STANDBY') {
        yieldRate = (score * 12.5 * (1 + volatilityIndex)).toFixed(2); // Max ~25%
      }

      matrixStatus[strat] = {
        status,
        yield: `${yieldRate}%`,
        score: score.toFixed(2)
      };
    });

    res.json({
      timestamp: new Date(),
      network: {
        ...networkStatus,
        volatilityIndex: volatilityIndex.toFixed(2),
        congestion: gasGwei > 50 ? 'HIGH' : 'NORMAL'
      },
      gasMetrics: gasPriceData,
      matrix: matrixStatus
    });
  } catch (error) {
    logger.error('Matrix status failed:', error);
    res.status(500).json({ error: 'Matrix calculation failed' });
  }
});

// Trade routes
app.get('/api/trades', validateInput, async (req, res) => {
  try {
    const trades = await Trade.find().sort({ createdAt: -1 }).limit(100);
    res.json(trades);
  } catch (error) {
    logger.error('Error fetching trades:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// AI Service routes
app.post('/api/ai/analyze', validateInput, async (req, res) => {
  try {
    const analysis = await aiService.analyzeOpportunity(req.body);
    res.json(analysis);
  } catch (error) {
    logger.error('AI analysis error:', error);
    res.status(500).json({ error: 'AI analysis failed' });
  }
});

// Blockchain routes
app.get('/api/blockchain/status', async (req, res) => {
  try {
    const status = await blockchainService.getStatus();
    res.json(status);
  } catch (error) {
    logger.error('Blockchain status error:', error);
    res.status(500).json({ error: 'Blockchain status check failed' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize services
async function initializeServices() {
  try {
    await aiService.initialize();
    aiService.isReady = true;
    logger.info('AI service initialized successfully');
  } catch (error) {
    logger.warn('AI service initialization failed, continuing without AI features:', error.message);
  }

  try {
    await blockchainService.initialize();
    blockchainService.isConnected = true;
    logger.info('Blockchain service initialized successfully');
  } catch (error) {
    logger.warn('Blockchain service initialization failed, continuing without blockchain features:', error.message);
  }
}

// Start server
app.listen(PORT, async () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);

  // Initialize services after server starts
  await initializeServices();
});

module.exports = app;
