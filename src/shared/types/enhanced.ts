// Enhanced Types for Enterprise DeFi Arbitrage System
// These types extend the base types with advanced features for Phase 1-4 implementation

// AI Specialist Framework
export interface AISpecialist {
  domain: 'arbitrage' | 'security' | 'market' | 'risk';
  expertise: string[];
  confidence: number;
  lastTraining: Date;
}

export interface TokenPair {
  base: string;
  quote: string;
  address?: string;
}

export interface DEX {
  name: string;
  version: string;
  router: string;
  factory?: string;
  chainId: number;
}

export interface ArbitrageStrategy {
  strategy: 'CROSS_DEX' | 'TRIANGULAR' | 'STATISTICAL' | 'CROSS_CHAIN' | 'YIELD' | 'LIQUIDITY';
  confidence: number;
  profitPotential: string;
  executionPath: string[];
  gasEstimate: string;
  slippageTolerance: number;
  timeWindow: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendedAction: 'EXECUTE' | 'MONITOR' | 'ABORT';
  optimizedSlippage?: number;
  optimizedGasPrice?: string;
  executionPriority?: string;
  alternativePaths?: string[][];
  riskAdjustments?: any;
}

export interface ArbitrageOpportunity {
  tokenPair: TokenPair;
  dexes: DEX[];
  priceDifferential: number;
  estimatedProfit: string;
  gasCost: string;
  netProfit: string;
  confidence: number;
  riskLevel: string;
  timestamp: Date;
}

export interface BigNumber {
  toString(): string;
  toNumber(): number;
  add(other: BigNumber): BigNumber;
  sub(other: BigNumber): BigNumber;
  mul(other: BigNumber): BigNumber;
  div(other: BigNumber): BigNumber;
  gt(other: BigNumber): boolean;
  lt(other: BigNumber): boolean;
  eq(other: BigNumber): boolean;
}

// Multi-Chain Arbitrage Types
export interface Chain {
  id: number;
  name: string;
  rpcUrl: string;
  nativeCurrency: string;
}

export interface Bridge {
  name: string;
  contract: string;
  supportedChains: number[];
  fee: number;
}

export interface CrossChainOpportunity {
  fromChain: Chain;
  toChain: Chain;
  bridge: Bridge;
  token: string;
  priceDiff: number;
  estimatedProfit: string;
  executionTime: number;
  riskLevel: string;
}

export interface ArbitrageMatrix {
  chains: Chain[];
  dexes: DEX[][];
  bridges: Bridge[];
  flashLoanProviders: any[];
}

// Swarm Intelligence Types
export interface TradingAgent {
  id: string;
  strategy: ArbitrageStrategy;
  fitness: number;
  generation: number;
  performance: AgentPerformance;
}

export interface AgentPerformance {
  totalTrades: number;
  successfulTrades: number;
  totalProfit: string;
  winRate: number;
  avgExecutionTime: number;
  lastTrade: Date;
}

export interface SwarmConfig {
  population: number;
  mutationRate: number;
  adaptationCycle: number;
  performanceMetrics: string[];
}

// Security Enhancement Types
export interface SecurityPosture {
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  activeDefenses: DefenseMechanism[];
  compliance: ComplianceStatus;
  lastAssessment: Date;
}

export interface DefenseMechanism {
  name: string;
  type: 'preventive' | 'detective' | 'responsive';
  status: 'active' | 'inactive' | 'failed';
  lastTriggered?: Date;
}

export interface ComplianceStatus {
  soc2: boolean;
  gdpr: boolean;
  kyc: boolean;
  aml: boolean;
  lastAudit: Date;
}

export interface ThreatLevel {
  level: 'low' | 'medium' | 'high' | 'critical';
  indicators: string[];
  recommendedActions: string[];
}

// Monitoring and Observability Types
export interface MetricConfig {
  name: string;
  type: 'counter' | 'gauge' | 'histogram';
  description: string;
  labels?: string[];
}

export interface TraceConfig {
  service: string;
  operation: string;
  tags: { [key: string]: string };
}

export interface LogConfig {
  level: 'error' | 'warn' | 'info' | 'debug';
  format: 'json' | 'text';
  destination: 'console' | 'file' | 'remote';
}

export interface AlertRule {
  name: string;
  condition: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  channels: string[];
}

export interface PerformanceReport {
  metrics: { [key: string]: number };
  anomalies: Anomaly[];
  insights: Insight[];
  timestamp: Date;
}

export interface Anomaly {
  metric: string;
  value: number;
  threshold: number;
  severity: string;
  description: string;
}

export interface Insight {
  type: 'performance' | 'risk' | 'opportunity';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  recommendation: string;
}

// DeFi Gateway Types
export interface Protocol {
  name: string;
  type: 'dex' | 'lending' | 'yield' | 'derivatives';
  contracts: { [chainId: number]: string };
  abi: any[];
}

export interface Aggregator {
  name: string;
  endpoint: string;
  supportedChains: number[];
  features: string[];
}

export interface LendingProtocol {
  name: string;
  contract: string;
  maxLTV: number;
  liquidationThreshold: number;
}

export interface DeFiGateway {
  protocols: Protocol[];
  aggregators: Aggregator[];
  bridges: Bridge[];
  lending: LendingProtocol[];
}

export interface ExecutionParams {
  slippageTolerance: number;
  deadline: number;
  gasPrice?: string;
  gasLimit?: string;
}

export interface ExecutionResult {
  quote: any;
  approval: any;
  execution: any;
  gasUsed: string;
  success: boolean;
  profit?: string;
}

// Market Data Types
export interface MarketData {
  volatility: number;
  volume24h: string;
  priceChange24h: number;
  liquidityDepth: { [dex: string]: string };
  gasPrice: string;
  timestamp: Date;
}

// Risk Management Types
export interface RiskProfile {
  maxDrawdown: number;
  valueAtRisk: number;
  sharpeRatio: number;
  sortinoRatio: number;
  maxPositionSize: string;
  stopLossPercentage: number;
}

export interface Position {
  token: string;
  amount: string;
  entryPrice: string;
  currentPrice: string;
  unrealizedPnL: string;
  riskLevel: string;
}

// Institutional Types
export interface InstitutionalClient {
  id: string;
  name: string;
  type: 'fund' | 'dao' | 'institution';
  riskProfile: RiskProfile;
  allocatedCapital: string;
  performance: ClientPerformance;
}

export interface ClientPerformance {
  totalReturn: string;
  annualizedReturn: string;
  maxDrawdown: number;
  sharpeRatio: number;
  lastUpdated: Date;
}

export interface ComplianceRecord {
  clientId: string;
  kycStatus: 'pending' | 'approved' | 'rejected';
  amlStatus: 'clear' | 'flagged' | 'restricted';
  geographicRestrictions: string[];
  lastReview: Date;
}

// Enhanced Bot Orchestrator Types
export interface EnhancedBotStatus {
  active: boolean;
  mode: 'scanning' | 'executing' | 'paused';
  performance: BotPerformance;
  lastAction: Date;
}

export interface BotPerformance {
  uptime: number;
  totalTrades: number;
  successfulTrades: number;
  totalProfit: string;
  avgExecutionTime: number;
  errorRate: number;
}

// Configuration Types
export interface ObservabilityConfig {
  metrics: MetricConfig[];
  traces: TraceConfig[];
  logs: LogConfig[];
  alerts: AlertRule[];
}

// Utility Types
export type ThreatLevelType = 'low' | 'medium' | 'high' | 'critical';
export type ComplianceStatusType = 'compliant' | 'non-compliant' | 'under-review';
export type ExecutionStatus = 'pending' | 'executing' | 'completed' | 'failed';
