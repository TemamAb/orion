// Core Domain Types
export interface Wallet {
  address: string;
  chain: string;
  balance: string;
  lastActivity: Date;
}

export interface Trade {
  id: string;
  walletAddress: string;
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  amountOut: string;
  dex: string;
  timestamp: Date;
  profit: string;
  gasUsed: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
}

export interface Strategy {
  id: string;
  name: string;
  type: 'ARBITRAGE' | 'FLASH_LOAN' | 'MEV' | 'LIQUIDITY';
  parameters: Record<string, any>;
  isActive: boolean;
  performance: StrategyPerformance;
}

export interface StrategyPerformance {
  totalTrades: number;
  successfulTrades: number;
  totalProfit: string;
  winRate: number;
  averageExecutionTime: number;
}

// Blockchain Types
export interface BlockchainStatus {
  connected: boolean;
  mode: string;
  accountType: string;
  accountAddress?: string;
  signer: boolean;
  network: string;
  blockNumber: number;
}

export interface FlashLoanProvider {
  name: string;
  chain: string;
  contractAddress: string;
  supportedTokens: string[];
  fee: number;
}

// Configuration Types
export interface AppConfig {
  environment: 'development' | 'staging' | 'production';
  port: number;
  database: DatabaseConfig;
  blockchain: BlockchainConfig;
  ai: AIConfig;
  security: SecurityConfig;
}

export interface DatabaseConfig {
  uri: string;
  name: string;
}

export interface BlockchainConfig {
  networks: Record<string, NetworkConfig>;
  privateKey?: string;
  smartAccountAddress?: string;
  pimlicoApiKey?: string;
}

export interface NetworkConfig {
  rpcUrl: string;
  chainId: number;
  flashLoanProviders: FlashLoanProvider[];
}

export interface AIConfig {
  apiKey: string;
  model?: string;
  maxRetries?: number;
  baseDelay?: number;
}

export interface SecurityConfig {
  jwtSecret: string;
  apiKey: string;
  corsOrigins: string[];
  rateLimits: RateLimitConfig;
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

// API Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  services: Record<string, boolean>;
  timestamp: Date;
}

// Bot Orchestrator Types
export interface BotStatus {
  active: boolean;
  captain: CaptainStatus;
  scanners: ScannerStatus[];
  executors: ExecutorStatus[];
  metrics: BotMetrics;
}

export interface CaptainStatus {
  status: string;
  decisionCycleMs: number;
  activeStrategies: string[];
  pendingOrders: number;
}

export interface ScannerStatus {
  id: string;
  type: string;
  target: string;
  status: string;
  hits: number;
}

export interface ExecutorStatus {
  id: string;
  type: string;
  capability: string;
  busy: boolean;
}

export interface BotMetrics {
  totalHits: number;
  activeThreads: number;
}
