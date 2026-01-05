export interface AIConfig {
  apiKey: string;
  model?: string;
  maxRetries?: number;
  baseDelay?: number;
}

export interface IAIService {
  analyzeWallet(walletAddress: string, chain?: string, transactionHistory?: any[]): Promise<WalletAnalysis>;
  auditTokenSecurity(tokenAddress: string, chain?: string): Promise<TokenAudit>;
  optimizeStrategy(marketConditions: any): Promise<StrategyOptimization>;
  isInitialized(): boolean;
}

export interface WalletAnalysis {
  label: string;
  strategy: string;
  winRate: number;
  totalPnl: string;
  dailyProfit: string;
  percentile: number;
  confidence: number;
  insights: string[];
}

export interface TokenAudit {
  securityScore: number;
  liquidityDepth: string;
  rugRisk: string;
  volumeStability: string;
  recommendation: string;
}

export interface StrategyOptimization {
  flashLoanAmount: string;
  dexPath: string[];
  slippageTolerance: number;
  gasLimit: string;
  riskLevel: string;
  expectedProfit: string;
}
