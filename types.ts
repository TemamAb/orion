
export interface Position {
  id: string;
  symbol: string;
  profit: number;
  status: 'active' | 'withdrawn' | 'failed';
  timestamp: number;
  recipient?: string;
}

export interface WalletState {
  address: string | null;
  manualAddress?: string;
  balance: string;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
}

// Added BotTierStatus to resolve error in components/BotTierDisplay.tsx
export interface BotTierStatus {
  captain: string;
  scanners: number;
  executors: number;
  avgTaskTime: number;
}

// Added SystemHealth to resolve error in App.tsx
export interface SystemHealth {
  network: boolean;
  node: boolean;
  contract: boolean;
  oracle: boolean;
  aiEngine: boolean;
  mevGuard: boolean;
  reserveNode: boolean;
}

export interface FlashLoanPerformance {
  profitPerHour: number;
  profitPerTrade: number;
  tradesPerHour: number;
  totalProfit: number;
  latency: number;
  // Shared properties used by index.tsx and App.tsx
  intelligenceScore?: number;
  aiInsights?: string;
  gasPrice?: string;
  blockNumber?: number;
  // Extended telemetry properties for core infrastructure view
  arbitrage?: {
    execDetectRatio: number;
    byStrategy: Array<{ name: string; percent: number; profit: number }>;
    byChain: Array<{ name: string; percent: number; profit: number }>;
    byPair: Array<{ name: string; percent: number; profit: number }>;
  };
  botTier?: BotTierStatus;
  ai?: {
    minsPerCycle: number;
    deltaPerCycle: number;
    totalDelta: number;
    totalCycles: number;
    intelligenceScore: number;
  };
  security?: {
    mevAttacksBlocked: number;
    frontRunningNeutralized: number;
    honeypotDetections: number;
    mevShieldEfficiency: number;
  };
  flashLoan?: {
    totalBorrowedVolume: number;
    loanCount: number;
    avgLoanSize: number;
    gasSpent: number;
    gasEfficiency: number;
  };
}

export interface BlockchainEvent {
  id: string;
  timestamp: number;
  type: 'ARB_DETECT' | 'TRADE_EXEC' | 'MEV_BLOCK' | 'GAS_SHIFT' | 'LIQUIDITY_FOUND' | 'NODE_SYNC' | 'AI_ANALYSIS';
  message: string;
  severity: 'info' | 'success' | 'warning' | 'danger';
}

export type WithdrawalMode = 'AUTO' | 'MANUAL';
