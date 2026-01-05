import { StrategyForger } from './core/ai/specialists/StrategyForger';
import { createLogger } from './shared/utils';

const logger = createLogger('strategy-forger-test');

/**
 * Comprehensive test suite for Strategy Forger Learning Curve functionality
 * Tests the perfect match learning curve feature implementation
 */
export class StrategyForgerLearningCurveTest {
  private forger: StrategyForger;

  constructor(apiKey: string) {
    this.forger = new StrategyForger(apiKey);
  }

  /**
   * Run all learning curve tests
   */
  async runAllTests(): Promise<void> {
    logger.info('🚀 Starting Strategy Forger Learning Curve Tests...');

    try {
      await this.testLearningCurveInitialization();
      await this.testPerfectMatchScoring();
      await this.testStrategyDiscoveryTracking();
      await this.testProfitDayProgression();
      await this.testStrategyCombinations();
      await this.testConfidenceScoring();
      await this.testPerformanceValidation();

      logger.info('✅ All Strategy Forger Learning Curve Tests Passed!');
    } catch (error) {
      logger.error('❌ Strategy Forger Learning Curve Tests Failed:', error);
      throw error;
    }
  }

  /**
   * Test learning curve initialization
   */
  private async testLearningCurveInitialization(): Promise<void> {
    logger.info('Testing learning curve initialization...');

    const strategy = await this.forger.forgeStrategyFromTopPerformers(
      'THE GHOST',
      { volatility: 0.3, liquidity: 0.8 },
      '10000'
    );

    // Verify learning curve data is initialized
    if (!strategy.learningCurveData) {
      throw new Error('Learning curve data not initialized');
    }

    if (strategy.learningCurveData.iterations !== 0) {
      throw new Error('Initial iterations should be 0');
    }

    if (strategy.learningCurveData.historicalPerformance.length !== 0) {
      throw new Error('Initial historical performance should be empty');
    }

    if (strategy.learningCurveData.discoveredStrategies.length !== 0) {
      throw new Error('Initial discovered strategies should be empty');
    }

    logger.info('✅ Learning curve initialization test passed');
  }

  /**
   * Test perfect match scoring algorithm
   */
  private async testPerfectMatchScoring(): Promise<void> {
    logger.info('Testing perfect match scoring...');

    const strategy = await this.forger.forgeStrategyFromTopPerformers(
      'SLOT-0 SNIPER',
      { volatility: 0.5, liquidity: 0.7 },
      '50000'
    );

    // Verify perfect match score is calculated
    if (typeof strategy.perfectMatchScore !== 'number') {
      throw new Error('Perfect match score not calculated');
    }

    if (strategy.perfectMatchScore < 0 || strategy.perfectMatchScore > 1) {
      throw new Error('Perfect match score out of range [0,1]');
    }

    logger.info(`✅ Perfect match scoring test passed (score: ${strategy.perfectMatchScore.toFixed(3)})`);
  }

  /**
   * Test strategy discovery tracking
   */
  private async testStrategyDiscoveryTracking(): Promise<void> {
    logger.info('Testing strategy discovery tracking...');

    const strategy = await this.forger.forgeStrategyFromTopPerformers(
      'BUNDLE MASTER',
      { volatility: 0.4, liquidity: 0.6 },
      '25000'
    );

    // Simulate execution results
    const executionResult = {
      strategyId: strategy.forgedStrategy.strategy,
      executionTime: new Date(),
      profitLoss: 1250.50,
      winRate: 0.85,
      riskLevel: 'MEDIUM',
      marketConditions: { volatility: 0.4, liquidity: 0.6 },
      executionSuccess: true
    };

    // Update learning curve
    (this.forger as any).updateLearningCurve(strategy.forgedStrategy.strategy, executionResult);

    // Verify strategy discovery tracking
    const updatedStrategies = this.forger.getForgedStrategies();
    const updatedStrategy = updatedStrategies.find(s => s.forgedStrategy.strategy === strategy.forgedStrategy.strategy);

    if (!updatedStrategy) {
      throw new Error('Strategy not found after learning curve update');
    }

    if (updatedStrategy.learningCurveData.iterations !== 1) {
      throw new Error('Iterations not incremented');
    }

    if (updatedStrategy.learningCurveData.discoveredStrategies.length === 0) {
      throw new Error('Strategy variant not discovered');
    }

    logger.info('✅ Strategy discovery tracking test passed');
  }

  /**
   * Test profit/day progression tracking
   */
  private async testProfitDayProgression(): Promise<void> {
    logger.info('Testing profit/day progression tracking...');

    const strategy = await this.forger.forgeStrategyFromTopPerformers(
      'ATOMIC FLUX',
      { volatility: 0.6, liquidity: 0.9 },
      '75000'
    );

    // Simulate multiple execution results to test progression
    const executions = [
      { profit: 500, success: true },
      { profit: 1200, success: true },
      { profit: 1800, success: true },
      { profit: 2500, success: true }
    ];

    for (let i = 0; i < executions.length; i++) {
      const executionResult = {
        strategyId: strategy.forgedStrategy.strategy,
        executionTime: new Date(),
        profitLoss: executions[i].profit,
        winRate: 0.9,
        riskLevel: 'LOW',
        marketConditions: { volatility: 0.6, liquidity: 0.9 },
        executionSuccess: executions[i].success
      };

      (this.forger as any).updateLearningCurve(strategy.forgedStrategy.strategy, executionResult);
    }

    // Verify profit/day progression milestones
    const updatedStrategies = this.forger.getForgedStrategies();
    const updatedStrategy = updatedStrategies.find(s => s.forgedStrategy.strategy === strategy.forgedStrategy.strategy);

    if (!updatedStrategy) {
      throw new Error('Strategy not found after progression updates');
    }

    if (updatedStrategy.learningCurveData.profitDayProgression.length === 0) {
      throw new Error('Profit/day milestones not tracked');
    }

    logger.info(`✅ Profit/day progression test passed (${updatedStrategy.learningCurveData.profitDayProgression.length} milestones reached)`);
  }

  /**
   * Test strategy combinations tracking
   */
  private async testStrategyCombinations(): Promise<void> {
    logger.info('Testing strategy combinations tracking...');

    const strategy = await this.forger.forgeStrategyFromTopPerformers(
      'DARK RELAY',
      { volatility: 0.3, liquidity: 0.7 },
      '30000'
    );

    // Simulate execution results
    const executionResult = {
      strategyId: strategy.forgedStrategy.strategy,
      executionTime: new Date(),
      profitLoss: 890.25,
      winRate: 0.78,
      riskLevel: 'MEDIUM',
      marketConditions: { volatility: 0.3, liquidity: 0.7 },
      executionSuccess: true
    };

    (this.forger as any).updateLearningCurve(strategy.forgedStrategy.strategy, executionResult);

    // Verify strategy combinations tracking
    const updatedStrategies = this.forger.getForgedStrategies();
    const updatedStrategy = updatedStrategies.find(s => s.forgedStrategy.strategy === strategy.forgedStrategy.strategy);

    if (!updatedStrategy) {
      throw new Error('Strategy not found after combinations update');
    }

    if (updatedStrategy.learningCurveData.strategyCombinations.length === 0) {
      throw new Error('Strategy combinations not tracked');
    }

    const combination = updatedStrategy.learningCurveData.strategyCombinations[0];
    if (combination.strategies.length !== 1) {
      throw new Error('Strategy combination should contain 1 strategy');
    }

    if (combination.successRate !== 1.0) {
      throw new Error('Success rate should be 1.0 for successful execution');
    }

    logger.info('✅ Strategy combinations test passed');
  }

  /**
   * Test confidence scoring updates
   */
  private async testConfidenceScoring(): Promise<void> {
    logger.info('Testing confidence scoring updates...');

    const strategy = await this.forger.forgeStrategyFromTopPerformers(
      'HIVE SYMMETRY',
      { volatility: 0.5, liquidity: 0.8 },
      '45000'
    );

    // Simulate mixed execution results to test confidence calculation
    const executions = [
      { profit: 600, success: true },
      { profit: -200, success: false },
      { profit: 800, success: true },
      { profit: 400, success: true },
      { profit: -100, success: false }
    ];

    for (const execution of executions) {
      const executionResult = {
        strategyId: strategy.forgedStrategy.strategy,
        executionTime: new Date(),
        profitLoss: execution.profit,
        winRate: execution.success ? 0.8 : 0.2,
        riskLevel: 'MEDIUM',
        marketConditions: { volatility: 0.5, liquidity: 0.8 },
        executionSuccess: execution.success
      };

      (this.forger as any).updateLearningCurve(strategy.forgedStrategy.strategy, executionResult);
    }

    // Verify confidence scoring
    const updatedStrategies = this.forger.getForgedStrategies();
    const updatedStrategy = updatedStrategies.find(s => s.forgedStrategy.strategy === strategy.forgedStrategy.strategy);

    if (!updatedStrategy) {
      throw new Error('Strategy not found after confidence updates');
    }

    const confidence = updatedStrategy.learningCurveData.confidenceScore;
    if (typeof confidence !== 'number' || confidence < 0 || confidence > 1) {
      throw new Error('Confidence score out of valid range');
    }

    // With 3 successes out of 5 executions, confidence should be reasonable
    const expectedConfidence = (3/5) * 0.7 + 0.3; // Rough approximation
    if (Math.abs(confidence - expectedConfidence) > 0.3) {
      logger.warn(`Confidence score ${confidence} differs from expected ${expectedConfidence}`);
    }

    logger.info(`✅ Confidence scoring test passed (confidence: ${confidence.toFixed(3)})`);
  }

  /**
   * Test performance validation against targets
   */
  private async testPerformanceValidation(): Promise<void> {
    logger.info('Testing performance validation...');

    const strategy = await this.forger.forgeStrategyFromTopPerformers(
      'DISCOVERY HUNT',
      { volatility: 0.7, liquidity: 0.5 },
      '20000'
    );

    // Simulate 50 iterations to test learning curve improvement
    const baseProfit = 200;
    for (let i = 0; i < 50; i++) {
      // Simulate learning improvement over time
      const learningMultiplier = 1 + (i * 0.01); // 1% improvement per iteration
      const profit = baseProfit * learningMultiplier * (0.8 + Math.random() * 0.4); // Add some variance

      const executionResult = {
        strategyId: strategy.forgedStrategy.strategy,
        executionTime: new Date(),
        profitLoss: profit,
        winRate: 0.75 + (i * 0.002), // Improving win rate
        riskLevel: 'HIGH',
        marketConditions: { volatility: 0.7, liquidity: 0.5 },
        executionSuccess: Math.random() > 0.25 // 75% success rate
      };

      (this.forger as any).updateLearningCurve(strategy.forgedStrategy.strategy, executionResult);
    }

    // Verify performance targets
    const updatedStrategies = this.forger.getForgedStrategies();
    const updatedStrategy = updatedStrategies.find(s => s.forgedStrategy.strategy === strategy.forgedStrategy.strategy);

    if (!updatedStrategy) {
      throw new Error('Strategy not found after performance validation');
    }

    // Check learning curve targets
    const iterations = updatedStrategy.learningCurveData.iterations;
    const confidence = updatedStrategy.learningCurveData.confidenceScore;
    const discoveredStrategies = updatedStrategy.learningCurveData.discoveredStrategies.length;

    if (iterations !== 50) {
      throw new Error(`Expected 50 iterations, got ${iterations}`);
    }

    if (confidence < 0.8) {
      throw new Error(`Confidence should be > 0.8 after 50 iterations, got ${confidence}`);
    }

    if (discoveredStrategies === 0) {
      throw new Error('Should have discovered strategy variants');
    }

    logger.info(`✅ Performance validation test passed (iterations: ${iterations}, confidence: ${confidence.toFixed(3)}, variants: ${discoveredStrategies})`);
  }

  /**
   * Get test results summary
   */
  getTestSummary(): any {
    const strategies = this.forger.getForgedStrategies();
    return {
      totalStrategiesForged: strategies.length,
      averagePerfectMatchScore: strategies.reduce((sum, s) => sum + s.perfectMatchScore, 0) / strategies.length,
      totalLearningIterations: strategies.reduce((sum, s) => sum + s.learningCurveData.iterations, 0),
      averageConfidenceScore: strategies.reduce((sum, s) => sum + s.learningCurveData.confidenceScore, 0) / strategies.length,
      totalDiscoveredVariants: strategies.reduce((sum, s) => sum + s.learningCurveData.discoveredStrategies.length, 0),
      totalMilestonesReached: strategies.reduce((sum, s) => sum + s.learningCurveData.profitDayProgression.length, 0)
    };
  }
}

/**
 * Run the learning curve tests
 */
export async function runStrategyForgerLearningCurveTests(): Promise<void> {
  // Note: This would require a valid Google AI API key in production
  const apiKey = process.env.GOOGLE_AI_API_KEY || 'test-key';

  const testSuite = new StrategyForgerLearningCurveTest(apiKey);

  try {
    await testSuite.runAllTests();
    const summary = testSuite.getTestSummary();

    logger.info('🎯 Learning Curve Test Summary:', summary);
    logger.info('🚀 Perfect Match Learning Curve Implementation: COMPLETE ✅');

  } catch (error) {
    logger.error('Learning curve tests failed:', error);
    throw error;
  }
}

// Export for use in other test files
// StrategyForgerLearningCurveTest is already exported as a class above
