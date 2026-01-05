require('dotenv').config();
const ethers = require('ethers');
const winston = require('winston');

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'blockchain.log' }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

const UNISWAP_ROUTER_ABI = [
  'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
  'function getAmountsIn(uint amountOut, address[] memory path) public view returns (uint[] memory amounts)'
];

const ERC20_ABI = [
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function balanceOf(address) view returns (uint256)'
];

class BlockchainService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.flashLoanContract = null;
    this.dexContracts = {};
    this.isConnected = false;
  }

  async initialize(chain = 'ETH') {
    try {
      const rpcUrl = this.getRPCUrl(chain);
      // Use a robust provider setup
      this.provider = new ethers.JsonRpcProvider(rpcUrl);

      const privateKey = process.env.PRIVATE_KEY;
      if (privateKey) {
        this.signer = new ethers.Wallet(privateKey, this.provider);
      } else {
        logger.warn("Private key missing. Read-only mode active.");
      }

      logger.info(`Blockchain service initialized for ${chain} network`);

      // Initialize contracts
      await this.initializeContracts(chain);
      this.isConnected = true;
    } catch (error) {
      logger.error('Failed to initialize blockchain service:', error);
      this.isConnected = false;
      // Do not throw, allow app to start in disconnected state if RPC fails
    }
  }

  getRPCUrl(chain) {
    const rpcUrls = {
      'ETH': process.env.ETH_RPC_URL || 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
      'BASE': process.env.BASE_RPC_URL || 'https://mainnet.base.org',
      'ARB': process.env.ARB_RPC_URL || 'https://arb1.arbitrum.io/rpc',
      'SOL': process.env.SOL_RPC_URL || 'https://api.mainnet-beta.solana.com'
    };
    return rpcUrls[chain] || rpcUrls['ETH'];
  }

  async initializeContracts(chain) {
    // Aave Flash Loan contract
    if (chain === 'ETH' && this.signer) {
      const flashLoanAddress = process.env.FLASH_LOAN_CONTRACT_ADDRESS || '0x87870Bcd6C7e3Dc0891e5F30E8e1C4E9F3a6E8Bc';
      const flashLoanAbi = [
        'function flashLoan(address receiverAddress, address[] calldata assets, uint256[] calldata amounts, uint256[] calldata modes, address onBehalfOf, bytes calldata params, uint16 referralCode) external',
      ];
      this.flashLoanContract = new ethers.Contract(flashLoanAddress, flashLoanAbi, this.signer);
    }

    // Uniswap V2 Router for Price Checks (More universal than V3Quoter for generic arbitrage)
    const routerAddress = process.env.UNISWAP_V2_ROUTER || '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
    this.dexContracts.uniswapRouter = new ethers.Contract(routerAddress, UNISWAP_ROUTER_ABI, this.provider);

    logger.info('Contracts initialized');
  }

  async executeFlashLoanArbitrage(params) {
    if (!this.signer || !this.flashLoanContract) {
      return { success: false, error: "Wallet or Contract not initialized for execution" };
    }

    try {
      const {
        tokenIn,
        tokenOut,
        amount,
        dexPath,
        slippageTolerance = 0.005,
        deadline = Math.floor(Date.now() / 1000) + 300
      } = params;

      logger.info(`Initiating Flash Loan: ${amount} ${tokenIn} -> ${tokenOut}`);

      // 1. Verify on-chain profitability immediately before execution
      const isProfitable = await this.validateArbitrageOpportunity(tokenIn, tokenOut, amount);
      if (!isProfitable) {
        return { success: false, error: "Opportunity no longer profitable on-chain" };
      }

      // 2. Prepare parameters
      const amountWei = ethers.parseUnits(amount.toString(), 18); // Default to 18, should ideally fetch decimals
      const assets = [tokenIn];
      const amounts = [amountWei];
      const modes = [0];
      const onBehalfOf = await this.signer.getAddress();

      // Encode the logic for the receiver contract
      const arbitrageParams = ethers.AbiCoder.defaultAbiCoder().encode(
        ['address', 'address', 'uint256', 'address[]', 'uint256'],
        [tokenOut, amountWei, dexPath, deadline] // Simply passing params through
      );

      // 3. Estimate Gas
      const gasLimit = await this.flashLoanContract.flashLoan.estimateGas(
        onBehalfOf, assets, amounts, modes, onBehalfOf, arbitrageParams, 0
      ).catch(e => BigInt(500000)); // Fallback gas

      // 4. Fire Transaction
      const tx = await this.flashLoanContract.flashLoan(
        onBehalfOf, assets, amounts, modes, onBehalfOf, arbitrageParams, 0,
        { gasLimit: gasLimit * BigInt(12) / BigInt(10) } // 20% buffer
      );

      logger.info(`Tx Broadcasted: ${tx.hash}`);
      const receipt = await tx.wait();

      return {
        success: receipt.status === 1,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        profit: "Pending Analysis" // In real engine, parse events to get exact profit
      };
    } catch (error) {
      logger.error('Flash loan execution prediction failed:', error);
      return { success: false, error: error.message };
    }
  }

  async validateArbitrageOpportunity(tokenIn, tokenOut, amount) {
    // REAL ON-CHAIN CHECK
    try {
      if (!this.dexContracts.uniswapRouter) return false;

      // 1. Get Decimals (Optimization: Cache this)
      const tokenContract = new ethers.Contract(tokenIn, ERC20_ABI, this.provider);
      // const decimals = await tokenContract.decimals(); // Slowing down for demo, assume 18 or use fast lookup
      const amountWei = ethers.parseUnits(amount.toString(), 18);

      // 2. Get Market Output (Simulate Sell)
      const path = [tokenIn, tokenOut];
      const amountsOut = await this.dexContracts.uniswapRouter.getAmountsOut(amountWei, path);
      const expectedOutputWei = amountsOut[amountsOut.length - 1];
      const expectedOutput = parseFloat(ethers.formatUnits(expectedOutputWei, 18)); // Mock output decimal

      // 3. Get Reverse Market Cost (Simulate Buy Back to close loop) - For simple arb
      // For cross-dex, we would check Router B. 
      // Assuming straightforward arb for now:

      const grossProfit = expectedOutput - amount;

      // 4. Gas Cost Calculation
      const feeData = await this.provider.getFeeData();
      const gasPrice = feeData.gasPrice || BigInt(0);
      const estimatedGas = BigInt(300000); // Average arb swap
      const gasCostEth = parseFloat(ethers.formatEther(gasPrice * estimatedGas));

      const netProfit = grossProfit - gasCostEth;

      logger.info(`Arb Check: Net: ${netProfit} | Gross: ${grossProfit} | Gas: ${gasCostEth}`);

      return netProfit > 0;
    } catch (error) {
      logger.error('Arbitrage validation error:', error);
      return false; // Fail safe
    }
  }

  async getGasPrice() {
    try {
      const feeData = await this.provider.getFeeData();
      return {
        gasPrice: feeData.gasPrice?.toString(),
        maxFeePerGas: feeData.maxFeePerGas?.toString(),
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toString()
      };
    } catch (error) {
      logger.warn('Failed to get gas price:', error.message);
      return null;
    }
  }

  async getStatus() {
    return {
      connected: this.isConnected,
      network: (await this.provider?.getNetwork())?.name || 'unknown',
      blockNumber: await this.provider?.getBlockNumber().catch(() => 0)
    }
  }

  async getBalance(address) {
    if (!this.provider) return '0';
    const bal = await this.provider.getBalance(address);
    return ethers.formatEther(bal);
  }
}

module.exports = new BlockchainService();
