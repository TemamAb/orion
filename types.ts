
export interface NavItem {
  label: string;
  path: string;
}

export interface Strategy {
  id: string;
  name:string;
  totalWallets: number;
  status: 'Active' | 'Inactive';
  alphaWalletsDetected: number;
  avgPnlPerWallet: number;
  totalPnl: number;
  forgingPrecision: number;
  avgWinRate: number;
  dailyProfitShare: number;
  enabled: boolean;
  sourceOfTruth: {
    name: string;
    url: string;
  };
}

export interface DeploymentRecord {
  id: string;
  smartWalletAddress: string;
  contractNumber: string;
  blockchain: 'Arbitrum' | 'Base' | 'Ethereum';
  infrastructure: 'Google Cloud';
  timestamp: string;
  status: 'Active' | 'Inactive';
}

export interface ProfitDataPoint {
  time: string;
  profit: number;
}

export interface FlashLoanProviderData {
    name: string;
    value: number;
    fill: string;
}

export interface WithdrawalRecord {
  id: string;
  timestamp: Date;
  amount: number;
  currency: 'USD' | 'ETH';
  destinationAddress: string;
  status: 'Completed' | 'Pending' | 'Failed';
  txHash: string;
}

export interface LogEntry {
  timestamp: string;
  type: 'SCAN' | 'ORCHESTRATE' | 'EXECUTE' | 'SUCCESS' | 'FAIL' | 'INFO';
  message: string;
  data: Record<string, any>;
}

export interface ProjectMilestone {
  id: number;
  phase: string;
  milestone: string;
  gcpServices: string[];
  externalFeatures: string[];
  status: 'Completed' | 'In Progress' | 'Pending';
  details: string;
  timeHours: number;
}
