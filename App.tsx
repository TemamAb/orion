
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { UnifiedCommandCard } from './components/UnifiedCommandCard';
import { MetricCard } from './components/MetricCard';
import { SystemHealthStatus } from './components/SystemHealthStatus';
import { OrbitLogs } from './components/OrbitLogs';
import { AnalyticsBreakdown } from './components/AnalyticsBreakdown';
import { BotTierDisplay } from './components/BotTierDisplay';
import { LiveEventStream } from './components/LiveEventStream';
import { 
  Position, 
  WalletState, 
  FlashLoanPerformance, 
  SystemHealth, 
  WithdrawalMode,
  BlockchainEvent
} from './types';
import { 
  Zap, 
  ShieldAlert, 
  Cpu, 
  BarChart3, 
  Activity, 
  Target, 
  ShieldCheck, 
  Lock, 
  Eye, 
  Workflow, 
  BrainCircuit,
  Flame,
  Radio,
  ArrowUpRight,
  History
} from 'lucide-react';

const App: React.FC = () => {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    manualAddress: '',
    balance: '0.00',
    chainId: null,
    isConnected: false,
    isConnecting: false,
  });

  const [performance, setPerformance] = useState<FlashLoanPerformance>({
    profitPerHour: 124.50,
    profitPerTrade: 14.78,
    tradesPerHour: 8.4,
    totalProfit: 18450.22,
    latency: 84,
    arbitrage: {
      execDetectRatio: 78.4,
      byStrategy: [
        { name: 'Triangular', percent: 45, profit: 8302 },
        { name: 'Sandwich', percent: 30, profit: 5535 },
        { name: 'Cross-DEX', percent: 25, profit: 4612 },
      ],
      byChain: [
        { name: 'Ethereum', percent: 40, profit: 7380 },
        { name: 'Base', percent: 35, profit: 6457 },
        { name: 'Arbitrum', percent: 25, profit: 4612 },
      ],
      byPair: [
        { name: 'WETH/USDC', percent: 50, profit: 9225 },
        { name: 'WBTC/DAI', percent: 30, profit: 5535 },
        { name: 'LINK/ETH', percent: 20, profit: 3690 },
      ],
    },
    botTier: {
      captain: 'optimizing',
      scanners: 12,
      executors: 4,
      avgTaskTime: 12,
    },
    ai: {
      minsPerCycle: 3.2,
      deltaPerCycle: 0.0042,
      totalDelta: 12.45,
      totalCycles: 4280,
      intelligenceScore: 94,
    },
    security: {
      mevAttacksBlocked: 142,
      frontRunningNeutralized: 89,
      honeypotDetections: 12,
      mevShieldEfficiency: 99.8,
    },
    flashLoan: {
      totalBorrowedVolume: 1250000,
      loanCount: 842,
      avgLoanSize: 1484,
      gasSpent: 420.55,
      gasEfficiency: 43.8,
    }
  });

  const [health] = useState<SystemHealth>({
    network: true,
    node: true,
    contract: true,
    oracle: true,
    aiEngine: true,
    mevGuard: true,
    reserveNode: true,
  });

  const [withdrawable, setWithdrawable] = useState<number>(1240.85);
  const [withdrawMode, setWithdrawMode] = useState<WithdrawalMode>('MANUAL');
  const [isProcessingWithdrawal, setIsProcessingWithdrawal] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const [streamEvents, setStreamEvents] = useState<BlockchainEvent[]>([]);

  const updateWalletInfo = useCallback(async (address: string) => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) return;
    try {
      const [balanceHex, chainIdHex] = await Promise.all([
        ethereum.request({ method: 'eth_getBalance', params: [address, 'latest'] }),
        ethereum.request({ method: 'eth_chainId' })
      ]);
      const balance = (parseInt(balanceHex as string, 16) / 1e18).toFixed(4);
      const chainId = parseInt(chainIdHex as string, 16);
      setWallet(prev => ({ ...prev, address, balance, chainId, isConnected: true, isConnecting: false }));
    } catch (err) {
      console.error("Wallet update failed:", err);
      setWallet(prev => ({ ...prev, isConnecting: false }));
    }
  }, []);

  const checkWallet = useCallback(async () => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) return;
    try {
      const accounts = await ethereum.request({ method: 'eth_accounts' }) as string[];
      if (accounts && accounts.length > 0) updateWalletInfo(accounts[0]);
    } catch (err) {
      console.error("Silent account check failed:", err);
    }
  }, [updateWalletInfo]);

  useEffect(() => {
    const ethereum = (window as any).ethereum;
    checkWallet();
    const timer = setTimeout(checkWallet, 1000);
    if (ethereum) {
      const handleAccounts = (accounts: string[]) => {
        if (accounts.length > 0) updateWalletInfo(accounts[0]);
        else setWallet(prev => ({ ...prev, address: null, isConnected: false }));
      };
      ethereum.on('accountsChanged', handleAccounts);
      ethereum.on('chainChanged', checkWallet);
      return () => {
        ethereum.removeListener('accountsChanged', handleAccounts);
        ethereum.removeListener('chainChanged', checkWallet);
        clearTimeout(timer);
      };
    }
  }, [checkWallet, updateWalletInfo]);

  const generateEvent = useCallback(() => {
    const eventTypes: BlockchainEvent['type'][] = ['ARB_DETECT', 'TRADE_EXEC', 'MEV_BLOCK', 'GAS_SHIFT', 'LIQUIDITY_FOUND', 'NODE_SYNC'];
    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    let message = '';
    let severity: BlockchainEvent['severity'] = 'info';
    switch (type) {
      case 'ARB_DETECT': message = `Arb opportunity +${(Math.random() * 0.5).toFixed(3)}% detected on Uniswap V3.`; break;
      case 'TRADE_EXEC': message = `Trade executed. Profit: +$${(Math.random() * 50).toFixed(2)}. Gas efficiency optimized.`; severity = 'success'; break;
      case 'MEV_BLOCK': message = `Front-running attack blocked. MEV-Shield engaged successfully.`; severity = 'danger'; break;
      case 'GAS_SHIFT': message = `Gas price adjusted to ${Math.floor(Math.random() * 60 + 20)} Gwei for priority execution.`; severity = 'warning'; break;
      case 'LIQUIDITY_FOUND': message = `New liquidity pool depth identified. Re-routing bot scanners.`; severity = 'success'; break;
      case 'NODE_SYNC': message = `Node height synchronized. RPC Latency: 12ms.`; break;
    }
    const newEvent: BlockchainEvent = { id: Math.random().toString(36).substr(2, 9), timestamp: Date.now(), type, message, severity };
    setStreamEvents(prev => [newEvent, ...prev].slice(0, 50));
  }, []);

  useEffect(() => {
    const dataInterval = setInterval(() => {
      setWithdrawable(prev => prev + (Math.random() * 5));
      setPerformance(prev => ({
        ...prev,
        latency: 80 + Math.floor(Math.random() * 15),
        profitPerHour: prev.profitPerHour + (Math.random() * 2 - 1),
        tradesPerHour: 8 + Math.random(),
        profitPerTrade: 14 + Math.random(),
        ai: { ...prev.ai, totalCycles: prev.ai.totalCycles + 1, totalDelta: prev.ai.totalDelta + (Math.random() * 0.01) }
      }));
    }, 8000);
    const eventInterval = setInterval(() => { if (Math.random() > 0.3) generateEvent(); }, 3000);
    setPositions([
      { id: '1', symbol: 'WETH/USDC (Tri)', profit: 42.4, status: 'active', timestamp: Date.now() },
      { id: '2', symbol: 'WBTC/DAI (Cross)', profit: 89.1, status: 'active', timestamp: Date.now() - 5000 },
      { id: '3', symbol: 'LINK/ETH (Sand)', profit: 12.5, status: 'withdrawn', timestamp: Date.now() - 15000, recipient: '0x71...f3a2' },
    ]);
    return () => { clearInterval(dataInterval); clearInterval(eventInterval); };
  }, [generateEvent]);

  const executeWithdrawal = useCallback(async () => {
    const targetAddress = withdrawMode === 'AUTO' ? wallet.address : wallet.manualAddress;
    if (!targetAddress || !targetAddress.startsWith('0x') || targetAddress.length < 40) { alert("Invalid address."); return; }
    setIsProcessingWithdrawal(true);
    await new Promise(r => setTimeout(r, 2000));
    const withdrawnAmount = withdrawable;
    setPerformance(prev => ({ ...prev, totalProfit: prev.totalProfit + withdrawnAmount }));
    setWithdrawable(0);
    setIsProcessingWithdrawal(false);
    setPositions(prev => [{ id: Math.random().toString(), symbol: 'SETTLEMENT', profit: withdrawnAmount, status: 'withdrawn', timestamp: Date.now(), recipient: `${targetAddress.slice(0, 6)}...${targetAddress.slice(-4)}` }, ...prev.slice(0, 15)]);
  }, [wallet.address, wallet.manualAddress, withdrawMode, withdrawable]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-7xl space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-slate-800 pb-8 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
              <Zap className="text-emerald-400 w-8 h-8 fill-emerald-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
                AION ARCHITECT <span className="text-emerald-500 not-italic font-bold">CORE v3.5</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Quantum-Leap Arbitrage Infrastructure</p>
            </div>
          </div>
          <div className="flex gap-4">
             <div className="bg-slate-900/50 border border-slate-800 px-4 py-2 rounded-2xl flex items-center gap-3">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-slate-400 uppercase">Engine Status: <span className="text-emerald-500">OPERATIONAL</span></span>
             </div>
          </div>
        </div>

        {/* Master Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">

          {/* Row: Profit Analytics (Exactly One Row, 4 Key Metrics) */}
          <div className="md:col-span-12">
            <h2 className="text-[10px] text-emerald-500 font-black uppercase tracking-widest border-l-2 border-emerald-500 pl-3 mb-4">Profit Intelligence Matrix</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard 
                label="Profit / Hour" 
                value={`$${performance.profitPerHour.toFixed(2)}`} 
                subValue="+18.2% vs prev" 
                icon={<Activity className="w-4 h-4 text-emerald-400" />} 
              />
              <MetricCard 
                label="Profit / Trade" 
                value={`$${performance.profitPerTrade.toFixed(2)}`} 
                subValue="High Efficiency" 
                icon={<ArrowUpRight className="w-4 h-4 text-emerald-400" />} 
              />
              <MetricCard 
                label="Trades / Hour" 
                value={performance.tradesPerHour.toFixed(1)} 
                subValue="Optimal Velocity" 
                icon={<Zap className="w-4 h-4 text-yellow-400" />} 
              />
              <MetricCard 
                label="Total Profit" 
                value={`$${performance.totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
                subValue="Cumulative Yield" 
                icon={<History className="w-4 h-4 text-blue-400" />} 
              />
            </div>
          </div>
          
          {/* Row: Command Center & System Performance */}
          <div className="md:col-span-12 lg:col-span-8">
            <UnifiedCommandCard 
              wallet={wallet}
              totalProfit={performance.totalProfit}
              withdrawable={withdrawable}
              onWithdraw={executeWithdrawal}
              onUpdateWallet={updateWalletInfo}
              onSetConnecting={(v) => setWallet(p => ({...p, isConnecting: v}))}
              onDisconnect={() => setWallet(prev => ({...prev, address: null, isConnected: false}))}
              withdrawMode={withdrawMode}
              setWithdrawMode={setWithdrawMode}
              onManualAddressChange={(addr) => setWallet(p => ({...p, manualAddress: addr}))}
              isProcessing={isProcessingWithdrawal}
            />
          </div>

          <div className="md:col-span-12 lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4">
            <MetricCard label="Exec/Detect Ratio" value={`${performance.arbitrage.execDetectRatio}%`} subValue="Execution Grade" icon={<Target className="w-4 h-4 text-blue-400" />} />
            <MetricCard label="System Latency" value={`${performance.latency}ms`} subValue="Ultra-Low P99" icon={<Zap className="w-4 h-4 text-yellow-400" />} />
            <MetricCard label="AI Intelligence" value={`${performance.ai.intelligenceScore}/100`} subValue="Decision Score" icon={<BrainCircuit className="w-4 h-4 text-purple-400" />} />
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-center">
              <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest text-center">Node-Linked & Operational</span>
            </div>
          </div>

          {/* Row: Strategy Analytics Breakdowns */}
          <div className="md:col-span-12 lg:col-span-4">
            <AnalyticsBreakdown title="Strategies" data={performance.arbitrage.byStrategy} icon={<Workflow className="w-4 h-4 text-emerald-500" />} />
          </div>
          <div className="md:col-span-12 lg:col-span-4">
            <AnalyticsBreakdown title="Chains" data={performance.arbitrage.byChain} icon={<BarChart3 className="w-4 h-4 text-blue-500" />} />
          </div>
          <div className="md:col-span-12 lg:col-span-4">
            <AnalyticsBreakdown title="Pairs" data={performance.arbitrage.byPair} icon={<Activity className="w-4 h-4 text-purple-500" />} />
          </div>

          {/* Row: Flash Loan & Bot Analytics */}
          <div className="md:col-span-12 lg:col-span-6">
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2.5rem] space-y-4 h-full">
               <div className="flex items-center gap-2 mb-4">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-300">Flash Loan Analytics</h3>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Volume Borrowed</span>
                    <span className="text-xl font-bold text-white mono">${performance.flashLoan.totalBorrowedVolume.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Loan Count</span>
                    <span className="text-xl font-bold text-white mono">{performance.flashLoan.loanCount}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Gas Efficiency</span>
                    <span className="text-xl font-bold text-emerald-400 mono">{performance.flashLoan.gasEfficiency}x</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Total Gas Spent</span>
                    <span className="text-xl font-bold text-red-400 mono">${performance.flashLoan.gasSpent.toFixed(2)}</span>
                  </div>
               </div>
            </div>
          </div>
          
          <div className="md:col-span-12 lg:col-span-6 h-full">
            <BotTierDisplay status={performance.botTier} />
          </div>

          {/* Row: AI & Defense Clusters */}
          <div className="md:col-span-12 lg:col-span-6">
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2.5rem] space-y-4 h-full">
               <div className="flex items-center gap-2 mb-4">
                  <BrainCircuit className="w-4 h-4 text-purple-500" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-300">AI Optimization Cycles</h3>
               </div>
               <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 bg-slate-950/50 rounded-2xl border border-slate-800">
                    <p className="text-[8px] text-slate-500 uppercase font-black">Mins / Cycle</p>
                    <p className="text-sm font-bold text-white mono">{performance.ai.minsPerCycle}</p>
                  </div>
                  <div className="p-3 bg-slate-950/50 rounded-2xl border border-slate-800">
                    <p className="text-[8px] text-slate-500 uppercase font-black">Delta / Cycle</p>
                    <p className="text-sm font-bold text-emerald-400 mono">+{performance.ai.deltaPerCycle}</p>
                  </div>
                  <div className="p-3 bg-slate-950/50 rounded-2xl border border-slate-800">
                    <p className="text-[8px] text-slate-500 uppercase font-black">Total Cycles</p>
                    <p className="text-sm font-bold text-white mono">{performance.ai.totalCycles}</p>
                  </div>
               </div>
               <div className="pt-2">
                 <div className="flex justify-between items-center mb-1">
                   <span className="text-[10px] text-slate-500 font-black uppercase">Total Optimization Delta</span>
                   <span className="text-[10px] text-emerald-400 font-bold">+{performance.ai.totalDelta.toFixed(2)}%</span>
                 </div>
                 <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                   <div className="bg-emerald-500 h-full w-[65%]"></div>
                 </div>
               </div>
            </div>
          </div>

          <div className="md:col-span-12 lg:col-span-6">
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2.5rem] space-y-4 h-full">
               <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-300">Security & MEV Shield</h3>
               </div>
               <div className="flex items-center justify-between p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl mb-2">
                  <div className="flex items-center gap-3">
                     <Lock className="w-5 h-5 text-emerald-500" />
                     <div>
                        <p className="text-xs font-bold text-white uppercase tracking-tighter">MEV Shield Active</p>
                        <p className="text-[9px] text-slate-500 font-bold uppercase">Flashbots / MEV-Share Routing</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <div className="flex items-center gap-3 justify-end">
                        <div className="text-right">
                           <p className="text-lg font-bold text-emerald-400 mono">{performance.security.mevShieldEfficiency}%</p>
                           <p className="text-[8px] text-slate-500 uppercase font-black">Efficiency</p>
                        </div>
                        <div className="w-px h-8 bg-slate-800"></div>
                        <div className="text-right">
                           <p className="text-lg font-bold text-emerald-400 mono">{performance.security.mevAttacksBlocked}</p>
                           <p className="text-[8px] text-slate-500 uppercase font-black">Blocked</p>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-950/50 rounded-2xl border border-slate-800 flex justify-between items-center">
                     <span className="text-[9px] text-slate-400 uppercase font-bold">Front-run Def.</span>
                     <span className="text-xs font-bold text-blue-400 mono">{performance.security.frontRunningNeutralized}</span>
                  </div>
                  <div className="p-3 bg-slate-950/50 rounded-2xl border border-slate-800 flex justify-between items-center">
                     <span className="text-[9px] text-slate-400 uppercase font-bold">Honeypots</span>
                     <span className="text-xs font-bold text-red-400 mono">{performance.security.honeypotDetections}</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Row: History & Real-time Stream */}
          <div className="md:col-span-12 lg:col-span-8">
            <h2 className="text-[10px] text-slate-500 font-black uppercase tracking-widest border-l-2 border-slate-700 pl-3 mb-4">Settlement Orbit History</h2>
            <OrbitLogs positions={positions} />
          </div>

          <div className="md:col-span-12 lg:col-span-4">
            <h2 className="text-[10px] text-red-500 font-black uppercase tracking-widest border-l-2 border-red-500 pl-3 mb-4">Real-time Node Telemetry</h2>
            <LiveEventStream events={streamEvents} />
          </div>

          {/* Row: Infrastructure Foundation */}
          <div className="md:col-span-12 pt-4">
            <h2 className="text-[10px] text-emerald-500 font-black uppercase tracking-widest border-l-2 border-emerald-500 pl-3 text-center mb-6">Protocol Node Status Matrix</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              <SystemHealthStatus label="Network" status={health.network} />
              <SystemHealthStatus label="Primary Node" status={health.node} />
              <SystemHealthStatus label="Reserve Node" status={health.reserveNode} />
              <SystemHealthStatus label="Contracts" status={health.contract} />
              <SystemHealthStatus label="Oracles" status={health.oracle} />
              <SystemHealthStatus label="AION Engine" status={health.aiEngine} />
              <SystemHealthStatus label="MEV Shield" status={health.mevGuard} />
            </div>
          </div>

          {/* Row: Security Alert Footer */}
          <div className="md:col-span-12">
            <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-[2.5rem] flex items-center gap-6">
               <ShieldAlert className="text-red-500 w-8 h-8 animate-pulse flex-shrink-0" />
               <p className="text-[11px] md:text-xs text-slate-400 font-medium leading-relaxed">
                 <span className="text-red-400 font-black uppercase mr-2 tracking-widest">Architect Security Note:</span>
                 All transfers are recorded on-chain. Unauthorized manual overrides will trigger node isolation. 
                 Multi-signature confirmation required for settlements exceeding 100k USD. Engine utilizes Tri-Tier consensus.
               </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;
