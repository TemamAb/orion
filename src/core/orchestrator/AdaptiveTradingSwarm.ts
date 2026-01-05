import { createLogger } from '../../shared/utils';
import {
  TradingAgent,
  AgentPerformance,
  SwarmConfig,
  ArbitrageStrategy,
  ArbitrageOpportunity
} from '../../shared/types/enhanced';

const logger = createLogger('adaptive-trading-swarm');

export class AdaptiveTradingSwarm {
  private agents: TradingAgent[];
  private config: SwarmConfig;
  private generation: number = 0;
  private adaptationInterval: NodeJS.Timeout | null = null;
  private performanceHistory: AgentPerformance[][] = [];

  constructor(config: SwarmConfig) {
    this.config = config;
    this.agents = this.initializeSwarm();
    logger.info(`Initialized adaptive trading swarm with ${this.agents.length} agents`);
  }

  private initializeSwarm(): TradingAgent[] {
    const agents: TradingAgent[] = [];

    for (let i = 0; i < this.config.population; i++) {
      const agent: TradingAgent = {
        id: `agent-${i}`,
        strategy: this.generateRandomStrategy(),
        fitness: 0,
        generation: 0,
        performance: {
          totalTrades: 0,
          successfulTrades: 0,
          totalProfit: '0',
          winRate: 0,
          avgExecutionTime: 0,
          lastTrade: new Date()
        }
      };
      agents.push(agent);
    }

    return agents;
  }

  private generateRandomStrategy(): ArbitrageStrategy {
    const strategies = ['CROSS_DEX', 'TRIANGULAR', 'STATISTICAL', 'CROSS_CHAIN', 'YIELD', 'LIQUIDITY'];
    const riskLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    const actions = ['EXECUTE', 'MONITOR', 'ABORT'];

    return {
      strategy: strategies[Math.floor(Math.random() * strategies.length)] as any,
      confidence: Math.random() * 0.5 + 0.5, // 0.5-1.0
      profitPotential: (Math.random() * 1000 + 100).toFixed(2),
      executionPath: ['DEX_A', 'DEX_B'],
      gasEstimate: (Math.random() * 100000 + 50000).toString(),
      slippageTolerance: Math.random() * 0.02 + 0.001, // 0.1%-2.1%
      timeWindow: (Math.random() * 300 + 30).toFixed(0), // 30-330 seconds
      riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)] as any,
      recommendedAction: actions[Math.floor(Math.random() * actions.length)] as any
    };
  }

  async evolveStrategies(marketConditions: any): Promise<void> {
    try {
      logger.info(`Starting swarm evolution - Generation ${this.generation + 1}`);

      // Evaluate current population fitness
      const fitnessScores = await this.evaluatePopulation(marketConditions);

      // Store performance history
      this.performanceHistory.push(fitnessScores);

      // Select survivors (elitism)
      const survivors = this.selectFittest(fitnessScores);

      // Generate offspring through crossover
      const offspring = await this.crossover(survivors);

      // Apply mutations
      const mutants = this.mutate(offspring);

      // Create new population
      this.agents = [...survivors, ...mutants];
      this.generation++;

      // Update agent generations
      this.agents.forEach(agent => agent.generation = this.generation);

      logger.info(`Evolution complete - New population: ${this.agents.length} agents`);

    } catch (error) {
      logger.error('Swarm evolution failed:', error);
    }
  }

  private async evaluatePopulation(marketConditions: any): Promise<AgentPerformance[]> {
    const fitnessPromises = this.agents.map(async (agent, index) => {
      try {
        // Simulate strategy performance based on market conditions
        const performance = await this.simulateStrategyPerformance(agent.strategy, marketConditions);

        // Update agent fitness
        agent.fitness = this.calculateFitness(performance);
        agent.performance = { ...agent.performance, ...performance };

        return performance;

      } catch (error) {
        logger.error(`Failed to evaluate agent ${agent.id}:`, error);
        return agent.performance;
      }
    });

    return await Promise.all(fitnessPromises);
  }

  private async simulateStrategyPerformance(
    strategy: ArbitrageStrategy,
    marketConditions: any
  ): Promise<Partial<AgentPerformance>> {
    // Simulate trading performance based on strategy and market conditions
    const volatility = marketConditions.volatility || 0.5;
    const volume = parseFloat(marketConditions.volume24h || '1000000');

    // Base success rate influenced by strategy type and market conditions
    let baseSuccessRate = 0.6; // 60% base success rate

    // Adjust based on strategy type
    switch (strategy.strategy) {
      case 'CROSS_DEX':
        baseSuccessRate += 0.1; // More reliable
        break;
      case 'TRIANGULAR':
        baseSuccessRate += 0.05; // Moderate
        break;
      case 'CROSS_CHAIN':
        baseSuccessRate -= 0.1; // More complex
        break;
      case 'STATISTICAL':
        baseSuccessRate += volatility * 0.2; // Better in volatile markets
        break;
    }

    // Adjust for market conditions
    if (volatility > 0.7) baseSuccessRate += 0.1; // Better in high volatility
    if (volume > 5000000) baseSuccessRate += 0.05; // Better with high volume

    // Simulate trades
    const simulatedTrades = Math.floor(Math.random() * 50) + 10; // 10-60 trades
    const successfulTrades = Math.floor(simulatedTrades * baseSuccessRate);

    // Calculate profit based on success rate and market conditions
    const avgProfitPerTrade = (Math.random() * 100 + 50) * (1 + volatility);
    const totalProfit = successfulTrades * avgProfitPerTrade;

    return {
      totalTrades: simulatedTrades,
      successfulTrades,
      totalProfit: totalProfit.toFixed(2),
      winRate: successfulTrades / simulatedTrades,
      avgExecutionTime: Math.random() * 30 + 5, // 5-35 seconds
      lastTrade: new Date()
    };
  }

  private calculateFitness(performance: AgentPerformance): number {
    // Multi-objective fitness function
    const profitScore = parseFloat(performance.totalProfit) / 1000; // Normalize profit
    const winRateScore = performance.winRate * 100; // 0-100
    const efficiencyScore = Math.max(0, 100 - performance.avgExecutionTime); // Faster is better
    const consistencyScore = performance.totalTrades > 0 ?
      (performance.successfulTrades / performance.totalTrades) * 50 : 0;

    // Weighted combination
    return (profitScore * 0.4) + (winRateScore * 0.3) + (efficiencyScore * 0.2) + (consistencyScore * 0.1);
  }

  private selectFittest(fitnessScores: AgentPerformance[]): TradingAgent[] {
    // Sort agents by fitness
    const sortedAgents = this.agents
      .map((agent, index) => ({ agent, fitness: this.calculateFitness(fitnessScores[index]) }))
      .sort((a, b) => b.fitness - a.fitness);

    // Select top performers (elitism)
    const eliteCount = Math.floor(this.config.population * 0.2); // Top 20%
    const elites = sortedAgents.slice(0, eliteCount).map(item => item.agent);

    logger.info(`Selected ${elites.length} elite agents for next generation`);
    return elites;
  }

  private async crossover(survivors: TradingAgent[]): Promise<TradingAgent[]> {
    const offspring: TradingAgent[] = [];
    const targetOffspring = Math.floor(this.config.population * 0.7); // 70% from crossover

    while (offspring.length < targetOffspring && survivors.length >= 2) {
      // Select two random parents
      const parent1 = survivors[Math.floor(Math.random() * survivors.length)];
      const parent2 = survivors[Math.floor(Math.random() * survivors.length)];

      // Create offspring through strategy blending
      const child = await this.createOffspring(parent1, parent2);
      offspring.push(child);
    }

    logger.info(`Generated ${offspring.length} offspring through crossover`);
    return offspring;
  }

  private async createOffspring(parent1: TradingAgent, parent2: TradingAgent): Promise<TradingAgent> {
    // Blend strategies from both parents
    const strategy = { ...parent1.strategy };

    // Inherit traits with some randomization
    if (Math.random() > 0.5) {
      strategy.confidence = (parent1.strategy.confidence + parent2.strategy.confidence) / 2;
    }

    if (Math.random() > 0.5) {
      strategy.slippageTolerance = (parent1.strategy.slippageTolerance + parent2.strategy.slippageTolerance) / 2;
    }

    // Blend profit potential expectations
    const profit1 = parseFloat(parent1.strategy.profitPotential);
    const profit2 = parseFloat(parent2.strategy.profitPotential);
    strategy.profitPotential = ((profit1 + profit2) / 2).toFixed(2);

    return {
      id: `offspring-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      strategy,
      fitness: 0,
      generation: this.generation + 1,
      performance: {
        totalTrades: 0,
        successfulTrades: 0,
        totalProfit: '0',
        winRate: 0,
        avgExecutionTime: 0,
        lastTrade: new Date()
      }
    };
  }

  private mutate(offspring: TradingAgent[]): TradingAgent[] {
    const mutants: TradingAgent[] = [];
    const mutationCount = Math.floor(offspring.length * this.config.mutationRate);

    for (let i = 0; i < mutationCount; i++) {
      const original = offspring[i];
      const mutant = { ...original };

      // Apply random mutations to strategy parameters
      mutant.strategy = { ...original.strategy };

      // Mutate confidence
      if (Math.random() < 0.3) {
        mutant.strategy.confidence = Math.max(0.1, Math.min(1.0,
          original.strategy.confidence + (Math.random() - 0.5) * 0.2
        ));
      }

      // Mutate slippage tolerance
      if (Math.random() < 0.3) {
        mutant.strategy.slippageTolerance = Math.max(0.001, Math.min(0.05,
          original.strategy.slippageTolerance + (Math.random() - 0.5) * 0.01
        ));
      }

      // Occasionally change strategy type
      if (Math.random() < 0.1) {
        const strategies = ['CROSS_DEX', 'TRIANGULAR', 'STATISTICAL', 'CROSS_CHAIN', 'YIELD', 'LIQUIDITY'];
        mutant.strategy.strategy = strategies[Math.floor(Math.random() * strategies.length)] as any;
      }

      mutants.push(mutant);
    }

    logger.info(`Applied mutations to ${mutants.length} agents`);
    return [...offspring, ...mutants];
  }

  getBestAgent(): TradingAgent | null {
    if (this.agents.length === 0) return null;

    return this.agents.reduce((best, current) =>
      current.fitness > best.fitness ? current : best
    );
  }

  getSwarmStats(): {
    generation: number;
    population: number;
    averageFitness: number;
    bestFitness: number;
    diversity: number;
  } {
    const fitnesses = this.agents.map(agent => agent.fitness);
    const averageFitness = fitnesses.reduce((sum, f) => sum + f, 0) / fitnesses.length;
    const bestFitness = Math.max(...fitnesses);

    // Calculate diversity (standard deviation of fitness)
    const variance = fitnesses.reduce((sum, f) => sum + Math.pow(f - averageFitness, 2), 0) / fitnesses.length;
    const diversity = Math.sqrt(variance);

    return {
      generation: this.generation,
      population: this.agents.length,
      averageFitness,
      bestFitness,
      diversity
    };
  }

  startAdaptation(marketDataStream: any): void {
    if (this.adaptationInterval) {
      clearInterval(this.adaptationInterval);
    }

    this.adaptationInterval = setInterval(async () => {
      try {
        await this.evolveStrategies(marketDataStream.getCurrentData());
      } catch (error) {
        logger.error('Adaptation cycle failed:', error);
      }
    }, this.config.adaptationCycle);

    logger.info(`Started adaptive evolution with ${this.config.adaptationCycle}ms cycle`);
  }

  stopAdaptation(): void {
    if (this.adaptationInterval) {
      clearInterval(this.adaptationInterval);
      this.adaptationInterval = null;
      logger.info('Stopped adaptive evolution');
    }
  }

  // Export swarm state for persistence
  exportState(): any {
    return {
      generation: this.generation,
      agents: this.agents,
      config: this.config,
      performanceHistory: this.performanceHistory
    };
  }

  // Import swarm state
  importState(state: any): void {
    this.generation = state.generation;
    this.agents = state.agents;
    this.performanceHistory = state.performanceHistory;
    logger.info(`Imported swarm state - Generation ${this.generation}`);
  }
}
