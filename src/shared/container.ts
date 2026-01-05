import { Container } from 'inversify';
import { AppConfig } from './types';
import { DatabaseService } from '../infrastructure/database';
import { AIService } from '../core/ai';
import { BlockchainService } from '../core/blockchain';
import { BotOrchestrator } from '../core/orchestrator';

const container = new Container();

// Service identifiers
export const TYPES = {
  DatabaseService: Symbol.for('DatabaseService'),
  AIService: Symbol.for('AIService'),
  BlockchainService: Symbol.for('BlockchainService'),
  BotOrchestrator: Symbol.for('BotOrchestrator'),
  Config: Symbol.for('Config')
};

export class ServiceContainer {
  private container: Container;
  private config: AppConfig | null = null;

  constructor() {
    this.container = new Container();
    this.registerServices();
  }

  private registerServices(): void {
    // Register services with their interfaces
    this.container.bind<DatabaseService>(TYPES.DatabaseService).to(DatabaseService).inSingletonScope();
    this.container.bind<AIService>(TYPES.AIService).to(AIService).inSingletonScope();
    this.container.bind<BlockchainService>(TYPES.BlockchainService).to(BlockchainService).inSingletonScope();
    this.container.bind<BotOrchestrator>(TYPES.BotOrchestrator).to(BotOrchestrator).inSingletonScope();
  }

  async initialize(config: AppConfig): Promise<void> {
    this.config = config;

    // Bind configuration
    this.container.bind<AppConfig>(TYPES.Config).toConstantValue(config);

    // Initialize services
    const database = this.container.get<DatabaseService>(TYPES.DatabaseService);
    await database.connect();

    const aiService = this.container.get<AIService>(TYPES.AIService);
    // AI service initializes itself in constructor

    const blockchainService = this.container.get<BlockchainService>(TYPES.BlockchainService);
    await blockchainService.initialize('ETH'); // Default to ETH

    const orchestrator = this.container.get<BotOrchestrator>(TYPES.BotOrchestrator);
    // Orchestrator is ready to use
  }

  async dispose(): Promise<void> {
    const database = this.container.get<DatabaseService>(TYPES.DatabaseService);
    await database.disconnect();
  }

  get<T>(serviceIdentifier: symbol): T {
    return this.container.get<T>(serviceIdentifier);
  }

  get database(): DatabaseService {
    return this.get<DatabaseService>(TYPES.DatabaseService);
  }

  get ai(): AIService {
    return this.get<AIService>(TYPES.AIService);
  }

  get blockchain(): BlockchainService {
    return this.get<BlockchainService>(TYPES.BlockchainService);
  }

  get orchestrator(): BotOrchestrator {
    return this.get<BotOrchestrator>(TYPES.BotOrchestrator);
  }
}

// Export singleton instance
export const container = new ServiceContainer();
