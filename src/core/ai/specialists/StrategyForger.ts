 import { createLogger } from '../../../shared/utils';
import { GoogleGenAI } from '@google/genai';
import { AISpecialist, ArbitrageStrategy } from '../../../shared/types/enhanced';

const logger = createLogger('strategy-forger');

interface TopPerformer {
  walletAddress: string;
  classification: string;
  winRate: number;
  totalPnl: string;
  percentile: number;
  confidence: number;
  strategies: string[];
  performanceMetrics: any;
  riskRating: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  lastAnalyzed: Date;
}

interface ForgedStrategy {
  originalWallet: string;
  classification: string;
  forgedStrategy: ArbitrageStrategy;
  adaptationFactors: string[];
  expectedPerformance: {
    winRate: number;
    profitPotential: string;
    riskLevel: string;
  };
  executionParameters: any;
  perfectMatchScore: number;
  learningCurveData: LearningMetrics;
}

interface LearningMetrics {
  iterations: number;
  historicalPerformance: PerformanceHistory[];
  learningRate: number;
  confidenceScore: number;
  lastUpdated: Date;
  discoveredStrategies: StrategyVariant[]; // Full set of strategies discovered to hit profit/day target
  profitDayProgression: ProfitDayMilestone[]; // Learning progression towards target
  strategyCombinations: StrategyCombination[]; // Combinations tested to achieve target
}

interface PerformanceHistory {
  strategyId: string;
  executionTime: Date;
  profitLoss: number;
  winRate: number;
  riskLevel: string;
  marketConditions: any;
  executionSuccess: boolean;
}

interface PerfectMatchCriteria {
  marketCompatibility: number;
  executionCapability: number;
  riskAlignment: number;
  historicalSuccess: number;
  totalScore: number;
}

interface StrategyVariant {
  variantId: string;
  baseStrategy: string;
  modifications: string[];
  profitDayTarget: number;
  achievedProfitDay: number;
  discoveryIteration: number;
  marketConditions: any;
  successRate: number;
}

interface ProfitDayMilestone {
  milestoneId: string;
  targetProfitDay: number;
  achievedProfitDay: number;
  strategiesUsed: string[];
  iterationReached: number;
  timestamp: Date;
  marketConditions: any;
}

interface StrategyCombination {
  combinationId: string;
  strategies: string[];
  combinedProfitDay: number;
  synergyMultiplier: number;
  testedIterations: number;
  successRate: number;
  lastTested: Date;
}

export class StrategyForger implements AISpecialist {
  domain: 'arbitrage' | 'security' | 'market' | 'risk' = 'arbitrage';
  expertise = [
    'top-performer-analysis',
    'strategy-cloning',
    'performance-adaptation',
    'risk-calibration',
    'market-condition-adaptation'
  ];
  confidence = 0.92;
  lastTraining = new Date();

  private ai: GoogleGenAI;
  private topPerformersCache = new Map<string, TopPerformer[]>();
  private forgedStrategiesCache = new Map<string, ForgedStrategy>();
  private readonly CACHE_TTL = 15 * 60 * 1000; // 15 minutes

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  /**
   * CORE METHOD: Forge strategies by copying top performers
   * This is the heart of Orion's competitive advantage
   */
  async forgeStrategyFromTopPerformers(
    targetClassification: string,
    marketConditions: any,
    capitalAvailable: string
  ): Promise<ForgedStrategy> {
    try {
      logger.info(`Forging ${targetClassification} strategy from top performers`);

      // Step 1: Identify top performers in this classification
      const topPerformers = await this.identifyTopPerformers(targetClassification);

      if (topPerformers.length === 0) {
        throw new Error(`No top performers found for classification: ${targetClassification}`);
      }

      // Step 2: Analyze the best performer
      const bestPerformer = topPerformers[0];
      logger.info(`Selected top performer: ${bestPerformer.walletAddress} (${bestPerformer.winRate}% win rate)`);

      // Step 3: Reverse-engineer their strategy
      const reverseEngineeredStrategy = await this.reverseEngineerStrategy(bestPerformer, marketConditions);

      // Step 4: Adapt for our execution environment
      const adaptedStrategy = await this.adaptStrategyForExecution(
        reverseEngineeredStrategy,
        capitalAvailable,
        marketConditions
      );

      // Step 5: Calibrate risk parameters
      const calibratedStrategy = await this.calibrateRiskParameters(adaptedStrategy, bestPerformer);

      // Calculate perfect match score
      const perfectMatchScore = this.calculatePerfectMatchScore(bestPerformer, calibratedStrategy, marketConditions);

      // Initialize learning curve data
      const learningCurveData: LearningMetrics = {
        iterations: 0,
        historicalPerformance: [],
        learningRate: 0.1,
        confidenceScore: bestPerformer.confidence,
        lastUpdated: new Date(),
        discoveredStrategies: [], // Full set of strategies discovered to hit profit/day target
        profitDayProgression: [], // Learning progression towards target
        strategyCombinations: [] // Combinations tested to achieve target
      };

      const forgedStrategy: ForgedStrategy = {
        originalWallet: bestPerformer.walletAddress,
        classification: targetClassification,
        forgedStrategy: calibratedStrategy,
        adaptationFactors: [
          'capital-scaling',
          'gas-optimization',
          'slippage-adjustment',
          'timing-calibration',
          'risk-mitigation'
        ],
        expectedPerformance: {
          winRate: bestPerformer.winRate * 0.85, // Conservative estimate
          profitPotential: this.scaleProfitPotential(bestPerformer.totalPnl, capitalAvailable),
          riskLevel: this.assessForgedRiskLevel(bestPerformer, calibratedStrategy)
        },
        executionParameters: {
          capitalAllocated: capitalAvailable,
          maxSlippage: calibratedStrategy.slippageTolerance,
          gasLimit: calibratedStrategy.gasEstimate,
          executionTimeWindow: calibratedStrategy.timeWindow,
          riskChecks: ['flash-loan-safety', 'liquidity-depth', 'price-impact']
        },
        perfectMatchScore,
        learningCurveData
      };

      // Cache the forged strategy
      this.forgedStrategiesCache.set(`${targetClassification}-${Date.now()}`, forgedStrategy);

      logger.info(`Strategy forged successfully: ${targetClassification} from ${bestPerformer.walletAddress}`);
      return forgedStrategy;

    } catch (error) {
      logger.error('Strategy forging failed:', error);
      throw error;
    }
  }

  /**
   * Identify top performers for a specific strategy classification
   */
  private async identifyTopPerformers(classification: string): Promise<TopPerformer[]> {
    const cacheKey = `top-performers-${classification}`;

    // Check cache first
    const cached = this.topPerformersCache.get(cacheKey);
    if (cached && Date.now() - (cached[0]?.lastAnalyzed?.getTime() || 0) < this.CACHE_TTL) {
      return cached;
    }

    try {
      const prompt = `IDENTIFY TOP PERFORMERS FOR STRATEGY CLASSIFICATION: ${classification}

Based on blockchain analysis and performance metrics, identify the top 5 wallets that excel at this strategy:

${this.getStrategyDefinition(classification)}

CRITERIA FOR TOP PERFORMERS:
- Win rate > 75%
- Total PnL > $100K
- Consistent performance over 30+ days
- Low risk profile
- High confidence classification

Return JSON array of top performers with their metrics.`;

      const response = await this.ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                walletAddress: { type: "string" },
                classification: { type: "string" },
                winRate: { type: "number" },
                totalPnl: { type: "string" },
                percentile: { type: "number" },
                confidence: { type: "number" },
                strategies: { type: "array", items: { type: "string" } },
                performanceMetrics: { type: "object" },
                riskRating: { type: "string", enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] },
                lastAnalyzed: { type: "string" }
              }
            }
          }
        }
      });

      const topPerformers: TopPerformer[] = JSON.parse(response.text?.trim() || "[]");

      // Add lastAnalyzed timestamp
      topPerformers.forEach((performer) => {
        performer.lastAnalyzed = new Date();
      });

      // Sort by win rate and cache
      topPerformers.sort((a, b) => b.winRate - a.winRate);
      this.topPerformersCache.set(cacheKey, topPerformers);

      return topPerformers;

    } catch (error) {
      logger.error('Top performer identification failed:', error);
      return [];
    }
  }

  /**
   * Reverse engineer a top performer's strategy
   */
  private async reverseEngineerStrategy(
    performer: TopPerformer,
    marketConditions: any
  ): Promise<ArbitrageStrategy> {
    try {
      const prompt = `REVERSE ENGINEER TOP PERFORMER STRATEGY

WALLET: ${performer.walletAddress}
CLASSIFICATION: ${performer.classification}
WIN RATE: ${performer.winRate}%
TOTAL PNL: ${performer.totalPnl}
PERFORMANCE METRICS: ${JSON.stringify(performer.performanceMetrics)}

MARKET CONDITIONS: ${JSON.stringify(marketConditions)}

REVERSE ENGINEER their exact strategy parameters:
1. Entry/exit timing
2. Position sizing
3. Risk management
4. Execution methodology
5. Profit taking rules

Return the precise strategy they use for maximum replication accuracy.`;

      const response = await this.ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              strategy: { type: "string", enum: ["CROSS_DEX", "TRIANGULAR", "STATISTICAL", "CROSS_CHAIN", "YIELD", "LIQUIDITY"] },
              confidence: { type: "number" },
              profitPotential: { type: "string" },
              executionPath: { type: "array", items: { type: "string" } },
              gasEstimate: { type: "string" },
              slippageTolerance: { type: "number" },
              timeWindow: { type: "string" },
              riskLevel: { type: "string" },
              recommendedAction: { type: "string" },
              entryRules: { type: "array", items: { type: "string" } },
              exitRules: { type: "array", items: { type: "string" } },
              positionSizing: { type: "string" },
              riskManagement: { type: "object" }
            }
          }
        }
      });

      const strategy = JSON.parse(response.text?.trim() || "{}");

      logger.info(`Strategy reverse engineered for ${performer.walletAddress}`);
      return strategy;

    } catch (error) {
      logger.error('Strategy reverse engineering failed:', error);
      return this.getDefaultStrategy(performer.classification);
    }
  }

  /**
   * Adapt strategy for our execution environment
   */
  private async adaptStrategyForExecution(
    baseStrategy: ArbitrageStrategy,
    capitalAvailable: string,
    marketConditions: any
  ): Promise<ArbitrageStrategy> {
    try {
      const prompt = `ADAPT STRATEGY FOR EXECUTION ENVIRONMENT

BASE STRATEGY: ${JSON.stringify(baseStrategy)}
CAPITAL AVAILABLE: ${capitalAvailable}
MARKET CONDITIONS: ${JSON.stringify(marketConditions)}

ADAPTATIONS NEEDED:
1. Scale position size to available capital
2. Adjust slippage for current market volatility
3. Optimize gas pricing for current network conditions
4. Calibrate timing for our execution speed
5. Adjust risk parameters for our risk tolerance

Return the adapted strategy parameters.`;

      const response = await this.ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              strategy: { type: "string" },
              confidence: { type: "number" },
              profitPotential: { type: "string" },
              executionPath: { type: "array", items: { type: "string" } },
              gasEstimate: { type: "string" },
              slippageTolerance: { type: "number" },
              timeWindow: { type: "string" },
              riskLevel: { type: "string" },
              recommendedAction: { type: "string" },
              adaptations: { type: "array", items: { type: "string" } }
            }
          }
        }
      });

      const adapted = JSON.parse(response.text?.trim() || "{}");

      return {
        ...baseStrategy,
        ...adapted,
        profitPotential: adapted.profitPotential || baseStrategy.profitPotential,
        gasEstimate: adapted.gasEstimate || baseStrategy.gasEstimate,
        slippageTolerance: adapted.slippageTolerance || baseStrategy.slippageTolerance
      };

    } catch (error) {
      logger.error('Strategy adaptation failed:', error);
      return baseStrategy;
    }
  }

  /**
   * Calibrate risk parameters based on performer and our constraints
   */
  private async calibrateRiskParameters(
    strategy: ArbitrageStrategy,
    performer: TopPerformer
  ): Promise<ArbitrageStrategy> {
    // Adjust risk parameters based on performer's risk profile
    const riskMultiplier = performer.riskRating === 'LOW' ? 0.8 :
                          performer.riskRating === 'MEDIUM' ? 1.0 :
                          performer.riskRating === 'HIGH' ? 1.2 : 1.5;

    return {
      ...strategy,
      slippageTolerance: Math.min(strategy.slippageTolerance * riskMultiplier, 0.05),
      riskLevel: this.adjustRiskLevel(strategy.riskLevel, riskMultiplier)
    };
  }

  /**
   * Get strategy definition for AI analysis
   */
  private getStrategyDefinition(classification: string): string {
    const definitions: { [key: string]: string } = {
      'THE GHOST': 'Private Order Flow - Transactions appear in blocks without prior mempool detection using Flashbots Protect or private RPCs',
      'SLOT-0 SNIPER': 'Top-of-Block Priority - First transaction index (0-5) in the block using high gas priority fees',
      'BUNDLE MASTER': 'Sandwich & Atomic Batches - 3-transaction sequences (Buy -> Victim -> Sell) or multi-pool routing',
      'ATOMIC FLUX': 'Spatial Arbitrage - Buy Token A on DEX X, Sell Token A on DEX Y in the same transaction',
      'DARK RELAY': 'Just-In-Time Liquidity - Add Liq -> Swap executes -> Remove Liq (all in one block)',
      'HIVE SYMMETRY': 'Cluster/Copy Trading - Transaction timing correlates (<1s) with known alpha wallets',
      'DISCOVERY HUNT': 'Factory/Mempool Scanning - Interaction with contracts <5 minutes after deployment'
    };

    return definitions[classification] || 'Unknown strategy classification';
  }

  /**
   * Get default strategy if reverse engineering fails
   */
  private getDefaultStrategy(classification: string): ArbitrageStrategy {
    const defaults: { [key: string]: ArbitrageStrategy } = {
      'THE GHOST': {
        strategy: 'CROSS_DEX',
        confidence: 0.8,
        profitPotential: '2.5%',
        executionPath: ['Uniswap V3', 'SushiSwap'],
        gasEstimate: '250000',
        slippageTolerance: 0.003,
        timeWindow: '30',
        riskLevel: 'LOW',
        recommendedAction: 'EXECUTE'
      },
      'SLOT-0 SNIPER': {
        strategy: 'LIQUIDITY',
        confidence: 0.85,
        profitPotential: '1.8%',
        executionPath: ['Uniswap V3'],
        gasEstimate: '180000',
        slippageTolerance: 0.002,
        timeWindow: '15',
        riskLevel: 'MEDIUM',
        recommendedAction: 'EXECUTE'
      },
      'BUNDLE MASTER': {
        strategy: 'TRIANGULAR',
        confidence: 0.75,
        profitPotential: '3.2%',
        executionPath: ['Uniswap V3', 'SushiSwap', 'PancakeSwap'],
        gasEstimate: '350000',
        slippageTolerance: 0.005,
        timeWindow: '45',
        riskLevel: 'HIGH',
        recommendedAction: 'MONITOR'
      },
      'ATOMIC FLUX': {
        strategy: 'CROSS_DEX',
        confidence: 0.9,
        profitPotential: '1.2%',
        executionPath: ['Uniswap V3', 'Curve'],
        gasEstimate: '200000',
        slippageTolerance: 0.002,
        timeWindow: '20',
        riskLevel: 'LOW',
        recommendedAction: 'EXECUTE'
      },
      'DARK RELAY': {
        strategy: 'LIQUIDITY',
        confidence: 0.8,
        profitPotential: '4.1%',
        executionPath: ['Uniswap V3'],
        gasEstimate: '280000',
        slippageTolerance: 0.004,
        timeWindow: '25',
        riskLevel: 'MEDIUM',
        recommendedAction: 'EXECUTE'
      },
      'HIVE SYMMETRY': {
        strategy: 'STATISTICAL',
        confidence: 0.7,
        profitPotential: '2.8%',
        executionPath: ['Multiple DEXes'],
        gasEstimate: '300000',
        slippageTolerance: 0.003,
        timeWindow: '35',
        riskLevel: 'MEDIUM',
        recommendedAction: 'MONITOR'
      },
      'DISCOVERY HUNT': {
        strategy: 'YIELD',
        confidence: 0.6,
        profitPotential: '5.5%',
        executionPath: ['New Deployments'],
        gasEstimate: '220000',
        slippageTolerance: 0.006,
        timeWindow: '10',
        riskLevel: 'HIGH',
        recommendedAction: 'MONITOR'
      }
    };

    return defaults[classification] || defaults['THE GHOST'];
  }

  /**
   * Utility methods
   */
  private scaleProfitPotential(originalPnl: string, capitalAvailable: string): string {
    const originalValue = parseFloat(originalPnl.replace(/[$,M]/g, '')) * 1000000; // Convert to numbers
    const capitalValue = parseFloat(capitalAvailable);

    if (originalValue === 0) return '0%';

    const scaledProfit = (originalValue / capitalValue) * 100;
    return `${scaledProfit.toFixed(2)}%`;
  }

  private assessForgedRiskLevel(performer: TopPerformer, strategy: ArbitrageStrategy): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    // Risk assessment based on performer metrics and strategy parameters
    let riskScore = 0;

    if (performer.riskRating === 'HIGH') riskScore += 2;
    if (performer.riskRating === 'CRITICAL') riskScore += 3;

    if (strategy.slippageTolerance > 0.02) riskScore += 1;
    if (strategy.riskLevel === 'HIGH') riskScore += 2;
    if (strategy.riskLevel === 'CRITICAL') riskScore += 3;

    if (riskScore >= 5) return 'CRITICAL';
    if (riskScore >= 3) return 'HIGH';
    if (riskScore >= 1) return 'MEDIUM';
    return 'LOW';
  }

  private adjustRiskLevel(currentLevel: string, multiplier: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    const levels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    const currentIndex = levels.indexOf(currentLevel);

    if (currentIndex === -1) return 'MEDIUM';

    const newIndex = Math.min(Math.floor(currentIndex * multiplier), levels.length - 1);
    return levels[newIndex] as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  }

  /**
   * Get all forged strategies
   */
  getForgedStrategies(): ForgedStrategy[] {
    return Array.from(this.forgedStrategiesCache.values());
  }

  /**
   * Calculate perfect match score for strategy selection
   * DOMINANT FACTOR: Profit/Day Matching - Success is primarily measured by
   * the forged strategy achieving comparable daily profit performance to the original performer
   */
  private calculatePerfectMatchScore(
    performer: TopPerformer,
    strategy: ArbitrageStrategy,
    marketConditions: any
  ): number {
    let score = 0;

    // PROFIT/DAY MATCHING (50% weight) - DOMINANT SUCCESS METRIC
    // The core success criterion: Can this forged strategy replicate the performer's profit/day?
    const profitMatchingScore = this.calculateProfitDayMatching(performer, strategy, marketConditions);
    score += profitMatchingScore * 0.50;

    // Execution capability (20% weight) - Must be able to execute profitably
    const executionScore = this.calculateExecutionCapability(strategy);
    score += executionScore * 0.20;

    // Risk alignment (15% weight) - Risk profile compatibility
    const riskScore = this.calculateRiskAlignment(performer, strategy);
    score += riskScore * 0.15;

    // Market compatibility (15% weight) - Current market condition fit
    const marketScore = this.calculateMarketCompatibility(strategy, marketConditions);
    score += marketScore * 0.15;

    return Math.min(Math.max(score, 0), 1); // Normalize to 0-1
  }

  /**
   * Calculate market compatibility score
   */
  private calculateMarketCompatibility(strategy: ArbitrageStrategy, marketConditions: any): number {
    // Simple market compatibility based on volatility and liquidity
    const volatility = marketConditions.volatility || 0.5;
    const liquidity = marketConditions.liquidity || 0.5;

    // High volatility favors quick execution strategies
    const volatilityMatch = strategy.timeWindow ? Math.min(parseInt(strategy.timeWindow) / 60, 1) : 0.5;

    // High liquidity favors complex strategies
    const liquidityMatch = strategy.executionPath?.length > 1 ? liquidity : 1 - liquidity;

    return (volatilityMatch + liquidityMatch) / 2;
  }

  /**
   * Calculate execution capability score
   */
  private calculateExecutionCapability(strategy: ArbitrageStrategy): number {
    // Score based on gas efficiency and slippage tolerance
    const gasEfficiency = strategy.gasEstimate ? Math.min(500000 / parseInt(strategy.gasEstimate), 1) : 0.5;
    const slippageSafety = strategy.slippageTolerance ? Math.max(0, 1 - strategy.slippageTolerance * 10) : 0.5;

    return (gasEfficiency + slippageSafety) / 2;
  }

  /**
   * Calculate profit/day matching score - DOMINANT SUCCESS METRIC
   * Core success criterion: Can this forged strategy replicate the performer's profit/day?
   */
  private calculateProfitDayMatching(
    performer: TopPerformer,
    strategy: ArbitrageStrategy,
    marketConditions: any
  ): number {
    // Extract performer's daily profit metrics
    const performerMetrics = performer.performanceMetrics || {};
    const performerAvgDailyProfit = performerMetrics.avgDailyProfit || this.estimateDailyProfit(performer.totalPnl);
    const performerProfitConsistency = performerMetrics.profitConsistency || performer.winRate / 100;

    // Calculate strategy's expected daily profit potential
    const strategyProfitPotential = this.calculateStrategyProfitPotential(strategy, marketConditions);
    const strategyExecutionFrequency = this.calculateExecutionFrequency(strategy);

    // Profit/Day Matching Score (0-1)
    // How closely can the forged strategy match the performer's daily profit?
    const profitMatchingRatio = strategyProfitPotential / performerAvgDailyProfit;
    const profitMatchScore = Math.min(profitMatchingRatio, 1.0); // Cap at 1.0 for perfect matching

    // Consistency Matching Score (0-1)
    // How consistent is the strategy's profit compared to performer?
    const consistencyMatchScore = this.calculateConsistencyMatch(strategy, performerProfitConsistency);

    // Combined Score: 70% profit matching, 30% consistency
    return profitMatchScore * 0.7 + consistencyMatchScore * 0.3;
  }

  /**
   * Calculate strategy's profit potential based on parameters
   */
  private calculateStrategyProfitPotential(strategy: ArbitrageStrategy, marketConditions: any): number {
    const baseProfit = parseFloat(strategy.profitPotential?.replace('%', '') || '0') / 100;
    const marketMultiplier = marketConditions.volatility || 1.0;
    const liquidityMultiplier = marketConditions.liquidity || 1.0;

    // Adjust profit potential based on market conditions
    return baseProfit * marketMultiplier * liquidityMultiplier;
  }

  /**
   * Calculate how often the strategy can execute in a day
   */
  private calculateExecutionFrequency(strategy: ArbitrageStrategy): number {
    const timeWindow = parseInt(strategy.timeWindow || '60'); // minutes
    const executionsPerDay = Math.max(1, 1440 / timeWindow); // 1440 minutes in a day

    // Adjust for strategy complexity and market conditions
    const complexityMultiplier = strategy.executionPath?.length > 1 ? 0.7 : 1.0; // Complex strategies execute less frequently

    return executionsPerDay * complexityMultiplier;
  }

  /**
   * Calculate consistency match between strategy and performer
   */
  private calculateConsistencyMatch(strategy: ArbitrageStrategy, performerConsistency: number): number {
    // Strategy consistency based on risk level and slippage tolerance
    const riskLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    const riskIndex = riskLevels.indexOf(strategy.riskLevel || 'MEDIUM');
    const strategyConsistency = Math.max(0.1, 1 - (riskIndex * 0.2)); // Lower risk = higher consistency

    // Adjust for slippage tolerance
    const slippageAdjustment = Math.max(0, 1 - (strategy.slippageTolerance || 0) * 5);

    const strategyConsistencyScore = strategyConsistency * slippageAdjustment;

    // Return similarity score (closer to 1.0 = better match)
    return 1 - Math.abs(strategyConsistencyScore - performerConsistency);
  }

  /**
   * Estimate daily profit from total PnL (fallback when metrics not available)
   */
  private estimateDailyProfit(totalPnl: string): number {
    const pnlValue = parseFloat(totalPnl.replace(/[$,M]/g, '')) * 1000000; // Convert to numbers
    const estimatedDays = 90; // Assume 90 days of performance
    return pnlValue / estimatedDays;
  }

  /**
   * Calculate risk alignment score
   */
  private calculateRiskAlignment(performer: TopPerformer, strategy: ArbitrageStrategy): number {
    const riskLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    const performerRiskIndex = riskLevels.indexOf(performer.riskRating);
    const strategyRiskIndex = riskLevels.indexOf(strategy.riskLevel || 'MEDIUM');

    // Perfect alignment gets 1.0, each level difference reduces by 0.25
    const riskDifference = Math.abs(performerRiskIndex - strategyRiskIndex);
    return Math.max(0, 1 - riskDifference * 0.25);
  }

  /**
   * Update learning curve with execution results
   * LEARNING CURVE: Required to discover the full set of strategies needed to hit profit/day target
   */
  updateLearningCurve(strategyId: string, executionResult: PerformanceHistory): void {
    const strategies = Array.from(this.forgedStrategiesCache.values());
    const strategy = strategies.find(s => s.forgedStrategy.strategy === strategyId);

    if (strategy) {
      strategy.learningCurveData.historicalPerformance.push(executionResult);
      strategy.learningCurveData.iterations++;

      // Track discovered strategy variants
      this.trackStrategyDiscovery(strategy, executionResult);

      // Track profit/day progression milestones
      this.trackProfitDayProgression(strategy, executionResult);

      // Track strategy combinations tested
      this.trackStrategyCombinations(strategy, executionResult);

      strategy.learningCurveData.confidenceScore = this.calculateUpdatedConfidence(strategy.learningCurveData);
      strategy.learningCurveData.lastUpdated = new Date();

      logger.info(`Learning curve updated for strategy ${strategyId}: iterations=${strategy.learningCurveData.iterations}, discovered=${strategy.learningCurveData.discoveredStrategies.length}, confidence=${strategy.learningCurveData.confidenceScore}`);
    }
  }

  /**
   * Calculate updated confidence score based on performance history
   */
  private calculateUpdatedConfidence(learningData: LearningMetrics): number {
    if (learningData.historicalPerformance.length === 0) return 0.5;

    const recentPerformances = learningData.historicalPerformance.slice(-10); // Last 10 executions
    const successRate = recentPerformances.filter(p => p.executionSuccess).length / recentPerformances.length;
    const avgProfit = recentPerformances.reduce((sum, p) => sum + p.profitLoss, 0) / recentPerformances.length;

    // Weighted score: 70% success rate, 30% profit performance
    const profitScore = Math.max(0, Math.min(1, (avgProfit + 1000) / 2000)); // Normalize profit to 0-1
    return successRate * 0.7 + profitScore * 0.3;
  }

  /**
   * Get top performers with learning curve enhancement
   */
  async getEnhancedTopPerformers(classification: string): Promise<TopPerformer[]> {
    const basePerformers = await this.identifyTopPerformers(classification);

    // Enhance with learning curve data
    return basePerformers.map(performer => ({
      ...performer,
      confidence: this.applyLearningBoost(performer.confidence, classification)
    })).sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Apply learning boost based on historical performance
   */
  private applyLearningBoost(baseConfidence: number, classification: string): number {
    // Simple learning boost - in real implementation, this would use ML models
    const learningMultiplier = 1 + (Math.random() * 0.2); // 0-20% boost
    return Math.min(baseConfidence * learningMultiplier, 1.0);
  }

  /**
   * Track discovered strategy variants during learning
   */
  private trackStrategyDiscovery(strategy: ForgedStrategy, executionResult: PerformanceHistory): void {
    const existingVariant = strategy.learningCurveData.discoveredStrategies.find(
      v => v.baseStrategy === executionResult.strategyId
    );

    if (!existingVariant) {
      // New strategy variant discovered
      const variant: StrategyVariant = {
        variantId: `${executionResult.strategyId}-${Date.now()}`,
        baseStrategy: executionResult.strategyId,
        modifications: ['risk-adjusted', 'market-adapted', 'capital-scaled'],
        profitDayTarget: this.calculateProfitDayTarget(strategy),
        achievedProfitDay: executionResult.profitLoss,
        discoveryIteration: strategy.learningCurveData.iterations,
        marketConditions: executionResult.marketConditions,
        successRate: executionResult.executionSuccess ? 1.0 : 0.0
      };

      strategy.learningCurveData.discoveredStrategies.push(variant);
      logger.info(`New strategy variant discovered: ${variant.variantId} at iteration ${variant.discoveryIteration}`);
    } else {
      // Update existing variant success rate
      const totalExecutions = strategy.learningCurveData.historicalPerformance.filter(
        h => h.strategyId === executionResult.strategyId
      ).length;
      const successfulExecutions = strategy.learningCurveData.historicalPerformance.filter(
        h => h.strategyId === executionResult.strategyId && h.executionSuccess
      ).length;

      existingVariant.successRate = successfulExecutions / totalExecutions;
      existingVariant.achievedProfitDay = Math.max(existingVariant.achievedProfitDay, executionResult.profitLoss);
    }
  }

  /**
   * Track profit/day progression milestones
   */
  private trackProfitDayProgression(strategy: ForgedStrategy, executionResult: PerformanceHistory): void {
    const currentProfitDay = executionResult.profitLoss;
    const targetProfitDay = this.calculateProfitDayTarget(strategy);

    // Check if we've reached a new milestone (e.g., 25%, 50%, 75%, 100% of target)
    const milestones = [0.25, 0.5, 0.75, 1.0];
    const achievedMilestone = milestones.find(milestone =>
      currentProfitDay >= targetProfitDay * milestone &&
      !strategy.learningCurveData.profitDayProgression.some(p => p.achievedProfitDay >= targetProfitDay * milestone)
    );

    if (achievedMilestone) {
      const milestone: ProfitDayMilestone = {
        milestoneId: `milestone-${achievedMilestone}-${Date.now()}`,
        targetProfitDay: targetProfitDay * achievedMilestone,
        achievedProfitDay: currentProfitDay,
        strategiesUsed: [executionResult.strategyId],
        iterationReached: strategy.learningCurveData.iterations,
        timestamp: new Date(),
        marketConditions: executionResult.marketConditions
      };

      strategy.learningCurveData.profitDayProgression.push(milestone);
      logger.info(`Profit/day milestone reached: ${achievedMilestone * 100}% at iteration ${milestone.iterationReached}`);
    }
  }

  /**
   * Track strategy combinations tested during learning
   */
  private trackStrategyCombinations(strategy: ForgedStrategy, executionResult: PerformanceHistory): void {
    // For now, track individual strategies as combinations of size 1
    // In a more advanced implementation, this would track actual combinations
    const combinationId = `combo-${executionResult.strategyId}-${strategy.learningCurveData.iterations}`;

    const existingCombination = strategy.learningCurveData.strategyCombinations.find(
      c => c.combinationId === combinationId
    );

    if (!existingCombination) {
      const combination: StrategyCombination = {
        combinationId,
        strategies: [executionResult.strategyId],
        combinedProfitDay: executionResult.profitLoss,
        synergyMultiplier: 1.0, // No synergy for single strategies
        testedIterations: 1,
        successRate: executionResult.executionSuccess ? 1.0 : 0.0,
        lastTested: new Date()
      };

      strategy.learningCurveData.strategyCombinations.push(combination);
    } else {
      // Update existing combination
      existingCombination.combinedProfitDay = Math.max(existingCombination.combinedProfitDay, executionResult.profitLoss);
      existingCombination.testedIterations++;
      existingCombination.lastTested = new Date();

      const successfulTests = strategy.learningCurveData.historicalPerformance.filter(
        h => h.strategyId === executionResult.strategyId && h.executionSuccess
      ).length;
      existingCombination.successRate = successfulTests / existingCombination.testedIterations;
    }
  }

  /**
   * Calculate profit/day target for a strategy
   */
  private calculateProfitDayTarget(strategy: ForgedStrategy): number {
    // Extract target from expected performance or use default
    const expectedProfit = strategy.expectedPerformance.profitPotential;
    const profitValue = parseFloat(expectedProfit.replace('%', '')) / 100;
    return profitValue * 1000; // Convert to dollar amount (assuming $1000 capital base)
  }

  /**
   * Clear caches
   */
  clearCaches(): void {
    this.topPerformersCache.clear();
    this.forgedStrategiesCache.clear();
    logger.info('Strategy forger caches cleared');
  }
}
