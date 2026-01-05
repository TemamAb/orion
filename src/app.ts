import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { container } from './shared/container';
import { AppConfig } from './shared/types';
import { createLogger } from './shared/utils';
import strategyRoutes from './infrastructure/api/routes/strategies';

const logger = createLogger('app');

export class Application {
  private app: express.Application;
  private config: AppConfig;

  constructor(config: AppConfig) {
    this.config = config;
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet());
    this.app.use(compression());

    // CORS configuration
    this.app.use(cors({
      origin: this.config.security.corsOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
    }));

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // Rate limiting would be added here
  }

  private setupRoutes(): void {
    // Health check
    this.app.get('/api/health', (req, res) => {
      const dbHealthy = container.get('database').isHealthy();
      const aiReady = container.get('ai').isInitialized();

      res.json({
        status: dbHealthy && aiReady ? 'healthy' : 'unhealthy',
        services: {
          database: dbHealthy,
          ai: aiReady,
          blockchain: true // Would check blockchain connection
        },
        timestamp: new Date()
      });
    });

    // API routes
    this.app.use('/api/strategies', strategyRoutes);

    // Bot orchestrator routes
    this.app.get('/api/bots/status', (req, res) => {
      const orchestrator = container.get('orchestrator');
      res.json(orchestrator.getSystemStatus());
    });

    this.post('/api/bots/start', (req, res) => {
      const orchestrator = container.get('orchestrator');
      orchestrator.start();
      res.json({ success: true, message: 'Bot system started' });
    });

    this.post('/api/bots/stop', (req, res) => {
      const orchestrator = container.get('orchestrator');
      orchestrator.stop();
      res.json({ success: true, message: 'Bot system stopped' });
    });

    // AI routes
    this.app.post('/api/ai/analyze', async (req, res) => {
      try {
        const aiService = container.get('ai');
        const analysis = await aiService.analyzeWallet(
          req.body.walletAddress,
          req.body.chain,
          req.body.transactionHistory
        );
        res.json(analysis);
      } catch (error) {
        res.status(500).json({ error: 'AI analysis failed' });
      }
    });

    this.post('/api/ai/audit', async (req, res) => {
      try {
        const aiService = container.get('ai');
        const audit = await aiService.auditTokenSecurity(
          req.body.tokenAddress,
          req.body.chain
        );
        res.json(audit);
      } catch (error) {
        res.status(500).json({ error: 'Token audit failed' });
      }
    });

    // Blockchain routes
    this.app.get('/api/blockchain/status', async (req, res) => {
      try {
        const blockchainService = container.get('blockchain');
        const status = await blockchainService.getStatus();
        res.json(status);
      } catch (error) {
        res.status(500).json({ error: 'Blockchain status check failed' });
      }
    });

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({ error: 'Route not found' });
    });
  }

  private setupErrorHandling(): void {
    // Global error handler
    this.app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.error('Unhandled error:', err);
      res.status(500).json({
        error: 'Internal server error',
        timestamp: new Date()
      });
    });
  }

  async start(): Promise<void> {
    try {
      // Initialize services
      await container.initialize(this.config);

      // Start server
      this.app.listen(this.config.port, '0.0.0.0', () => {
        logger.info(`Server running on port ${this.config.port}`);
        logger.info(`Environment: ${this.config.environment}`);
      });
    } catch (error) {
      logger.error('Failed to start application:', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    await container.dispose();
    logger.info('Application stopped');
  }

  getApp(): express.Application {
    return this.app;
  }
}
