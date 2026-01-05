import { createLogger } from '../../shared/utils';
import { BotStatus, CaptainStatus, ScannerStatus, ExecutorStatus, BotMetrics } from '../../shared/types';
import { AIService } from '../ai';
import { BlockchainService } from '../blockchain';

const logger = createLogger('tri-tier-orchestrator');

/**
 * TRI-TIER ARCHITECTURE
 * 1. Scanners (The Eyes): High-frequency polling of mempool/DEXs
 * 2. Captain (The Brain): Orchestrates decisions, uses AI, checks gas
 * 3. Executors (The Hands): Flash loan execution and transaction signing
 */

export class BotOrchestrator {
  private scanners: ScannerStatus[] = [];
  private captain: CaptainStatus;
  private executors: ExecutorStatus[] = [];
  private isRunning: boolean = false;
  private loopInterval?: NodeJS.Timeout;
  private aiService?: AIService;
  private blockchainService?: BlockchainService;

  constructor(aiService?: AIService, blockchainService?: BlockchainService) {
    this.aiService = aiService;
    this.blockchainService = blockchainService;

    // Initialize TIER 1: SCANNERS
    this.scanners = [
      { id: 'SCN-ALPHA', type: 'MEMPOOL_WATCHER', target: 'UNI_V2', status: 'IDLE', hits: 0 },
      { id: 'SCN-BETA', type: 'DEX_ARBITRAGE', target: 'SUSHISWAP', status: 'IDLE', hits: 0 },
      { id: 'SCN-GAMMA', type: 'LIQUIDITY_DEPTH', target: 'CURVE', status: 'IDLE', hits: 0 }
    ];

    // Initialize TIER 2: CAPTAIN
    this.captain = {
      status: 'SLEEPING',
      decisionCycleMs: 2000,
      activeStrategies: [],
      pendingOrders: 0
    };

    // Initialize TIER 3: EXECUTORS
    this.executors = [
      { id: 'EXE-PRIME', type: 'FLASH_LOAN_AGENT', capability: 'HIGH_VALUE', busy: false },
      { id: 'EXE-SEC', type: 'GASLESS_RELAY', capability: 'HIGH_SPEED', busy: false }
    ];
  }

  /**
   * Start the Tri-Tier System
   */
  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.captain.status = 'ACTIVE';
    logger.info('Tri-Tier System Activated: Captain is now commanding the fleet.');

    // Dynamic Scaling: Auto-add scanners based on initial load
    this.autoScaleScanners();

    // Start the Pulse
    this.loopInterval = setInterval(() => this.orchestrationLoop(), this.captain.decisionCycleMs);
  }

  stop(): void {
    this.isRunning = false;
    this.captain.status = 'SLEEPING';
    if (this.loopInterval) {
      clearInterval(this.loopInterval);
      this.loopInterval = undefined;
    }
    logger.info('Tri-Tier System Deactivated.');
  }

  private async orchestrationLoop(): Promise<void> {
    try {
      // TIER 1: SCANNERS - Collect intelligence
      const opportunities = await this.scanForOpportunities();

      // TIER 2: CAPTAIN - Make decisions
      const decision = await this.captainDecision(opportunities);

      // TIER 3: EXECUTORS - Execute if profitable
      if (decision.action === 'EXECUTE') {
        const availableExecutor = this.executors.find(e => !e.busy);
        if (availableExecutor) {
          this.dispatchExecutor(availableExecutor, decision);
        } else {
          logger.warn("Decision made but NO executors available. Queueing...");
          // Dynamic Scaling: Add Executor on pressure
          if (this.executors.length < 5) {
            this.addExecutor('EXE-AUTO-' + Date.now().toString().slice(-4));
          }
        }
      } else {
        // Reset scanner status after cycle
        this.scanners.forEach(s => s.status = 'IDLE');
        this.captain.status = 'WATCHING';
      }
    } catch (error) {
      logger.error('Orchestration loop error:', error);
    }
  }

  private async scanForOpportunities(): Promise<any[]> {
    // Mock scanning - in real implementation this would scan mempool/DEXs
    const opportunities: any[] = [];

    for (const scanner of this.scanners) {
      scanner.status = 'SCANNING';

      // Simulate finding opportunities
      if (Math.random() > 0.7) { // 30% chance of finding opportunity
        opportunities.push({
          scanner: scanner.id,
          type: scanner.type,
          target: scanner.target,
          profit: Math.random() * 1000,
          risk: Math.random() * 0.1
        });
        scanner.hits++;
      }

      scanner.status = 'IDLE';
    }

    return opportunities;
  }

  private async captainDecision(opportunities: any[]): Promise<{ action: 'EXECUTE' | 'WAIT'; data?: any }> {
    this.captain.status = 'DECIDING';

    if (opportunities.length === 0) {
      return { action: 'WAIT' };
    }

    // Use AI for decision making if available
    if (this.aiService?.isInitialized()) {
      try {
        const marketConditions = {
          gasPrice: await this.blockchainService?.getGasPrice(),
          opportunities: opportunities.length,
          networkLoad: Math.random() // Mock network load
        };

        const optimization = await this.aiService.optimizeStrategy(marketConditions);

        // Check if profitable using blockchain service
        const bestOpportunity = opportunities[0]; // Simplified
        const arbCheck = await this.blockchainService?.checkArbitrageOpportunity(
          optimization.flashLoanAmount,
          'TOKEN_IN',
          'TOKEN_OUT',
          optimization.dexPath
        );

        if (arbCheck?.profitable) {
          return { action: 'EXECUTE', data: { ...optimization, opportunity: bestOpportunity } };
        }
      } catch (error) {
        logger.warn('AI decision making failed, using fallback:', error);
      }
    }

    // Fallback: Simple profitability check
    const profitableOpportunities = opportunities.filter(opp => opp.profit > opp.risk * 100);
    if (profitableOpportunities.length > 0) {
      return { action: 'EXECUTE', data: profitableOpportunities[0] };
    }

    return { action: 'WAIT' };
  }

  private async dispatchExecutor(executor: ExecutorStatus, decision: any): Promise<void> {
    executor.busy = true;
    this.captain.pendingOrders++;
    logger.info(`Captain dispatched ${executor.id} for execution.`);

    try {
      // Mock execution time - in real implementation this would execute flash loan
      await new Promise(resolve => setTimeout(resolve, 4500));

      logger.info(`${executor.id} returned successfully.`);
    } catch (error) {
      logger.error(`${executor.id} execution failed:`, error);
    } finally {
      executor.busy = false;
      this.captain.pendingOrders--;
    }
  }

  /**
   * Dynamic Scaling Logic
   */
  private autoScaleScanners(): void {
    const marketLoad = "HIGH"; // Mock market load
    if (marketLoad === "HIGH") {
      this.addScanner('SCN-DELTA-AUTO', 'MEMPOOL_SHARD_1');
      this.addScanner('SCN-EPSILON-AUTO', 'MEMPOOL_SHARD_2');
      logger.info("Market Load High: Auto-scaled Scanners to 5 nodes.");
    }
  }

  private addScanner(id: string, target: string): void {
    this.scanners.push({
      id,
      type: 'DYNAMIC_SCALER',
      target,
      status: 'IDLE',
      hits: 0
    });
  }

  private addExecutor(id: string): void {
    this.executors.push({
      id,
      type: 'DYNAMIC_RELAY',
      capability: 'std',
      busy: false
    });
  }

  /**
   * Monitoring API Data
   */
  getSystemStatus(): BotStatus {
    return {
      active: this.isRunning,
      captain: this.captain,
      scanners: this.scanners,
      executors: this.executors,
      metrics: {
        totalHits: this.scanners.reduce((acc, s) => acc + s.hits, 0),
        activeThreads: this.scanners.length + this.executors.length + 1
      }
    };
  }
}
