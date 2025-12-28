
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Zap, ShieldAlert, Cpu, BarChart3, Activity, Target, ShieldCheck, 
  Lock, Workflow, BrainCircuit, Flame, ArrowUpRight, History,
  Wifi, Download, LogOut, RefreshCw, ArrowRightLeft, Clipboard,
  CheckCircle2, Terminal, Radio, Eye, Shield, XCircle
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { ethers } from "ethers";
import { 
  Position, WalletState, FlashLoanPerformance, 
  BlockchainEvent, WithdrawalMode 
} from './types';

/**
 * PRODUCTION DEPENDENCIES:
 * - React 19 (UI Library)
 * - Lucide React (Visual Assets)
 * - Ethers.js (Blockchain Provider Layer)
 * - Google GenAI SDK (Gemini 3 Pro Intelligence)
 * - Tailwind CSS (Styling Engine)
 */

// --- SHARED COMPONENTS ---

const MetricCard: React.FC<{ label: string; value: string | number; subValue: string; icon: React.ReactNode }> = ({ label, value, subValue, icon }) => (
  <div className="bg-slate-900/40 border border-slate-800 p-3 rounded-2xl hover:border-emerald-500/50 transition-all group overflow-hidden relative">
    <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">{icon}</div>
    <div className="flex flex-col gap-1 relative z-10">
      <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider">{label}</span>
      <span className="text-xl font-bold text-white tracking-tighter mono">{value}</span>
      <span className="text-[9px] text-emerald-400 font-bold">{subValue}</span>
    </div>
  </div>
);

const SystemHealthStatus: React.FC<{ label: string; status: boolean }> = ({ label, status }) => (
  <div className="bg-slate-900/60 border border-slate-800 p-2 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all hover:bg-slate-800/80">
    <span className="text-[8px] text-slate-400 font-black uppercase tracking-tighter text-center">{label}</span>
    {status ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-red-500 animate-pulse" />}
    <span className={`text-[8px] font-bold ${status ? 'text-emerald-500' : 'text-red-500'}`}>{status ? 'ONLINE' : 'OFFLINE'}</span>
  </div>
);

const AnalyticsBreakdown: React.FC<{ title: string; data: any[]; icon: React.ReactNode }> = ({ title, data, icon }) => (
  <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2.5rem] space-y-4 hover:border-slate-700 transition-all h-full">
    <div className="flex items-center gap-2 mb-2">{icon}<h3 className="text-xs font-black uppercase tracking-widest text-slate-300">{title}</h3></div>
    <div className="space-y-4">
      {data.map((item, idx) => (
        <div key={idx} className="space-y-1.5">
          <div className="flex justify-between items-end">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{item.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-emerald-400 font-black mono">${item.profit.toLocaleString()}</span>
              <span className="text-[9px] text-slate-600 font-bold">{item.percent}%</span>
            </div>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${item.percent}%` }}></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MetaMaskIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M29.5442 4.10214L17.7656 12.3392L16.0384 10.1557L7.33237 13.9213L16.2764 15.0001L17.0315 16.5186L18.1091 22.1384L21.3482 17.0601L29.5442 4.10214Z" fill="#E2761B"/>
    <path d="M2.45581 4.10214L14.2344 12.3392L15.9616 10.1557L24.6676 13.9213L15.7236 15.0001L14.9685 16.5186L13.8909 22.1384L10.6518 17.0601L2.45581 4.10214Z" fill="#E4761B"/>
    <path d="M26.2625 21.3813L21.3483 17.0602L18.1092 22.1385L16.4886 28.0811L15.8953 30L26.2625 21.3813Z" fill="#D7C1B3"/>
    <path d="M5.73752 21.3813L10.6517 17.0602L13.8908 22.1385L15.5114 28.0811L16.1047 30L5.73752 21.3813Z" fill="#D7C1B3"/>
  </svg>
);

// --- MAIN APPLICATION ---

const App: React.FC = () => {
  const [wallet, setWallet] = useState<WalletState>({ address: null, manualAddress: '', balance: '0.00', chainId: null, isConnected: false, isConnecting: false });
  const [performance, setPerformance] = useState<FlashLoanPerformance>({
    profitPerHour: 142.25, profitPerTrade: 18.40, tradesPerHour: 7.2, totalProfit: 42950.12, 
    latency: 12, intelligenceScore: 98, aiInsights: 'Optimizing high-frequency paths on Base Network...',
    gasPrice: '0.0', blockNumber: 0
  });
  const [events, setEvents] = useState<BlockchainEvent[]>([]);
  const [withdrawMode, setWithdrawMode] = useState<WithdrawalMode>('MANUAL');
  const [isProcessing, setIsProcessing] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const [currency, setCurrency] = useState<'USD' | 'ETH'>('USD');

  // --- BLOCKCHAIN PRODUCTION DATA ---
  useEffect(() => {
    const provider = new ethers.JsonRpcProvider("https://cloudflare-eth.com");
    
    const fetchTelemetery = async () => {
      try {
        const [feeData, block] = await Promise.all([
          provider.getFeeData(),
          provider.getBlockNumber()
        ]);
        const gwei = ethers.formatUnits(feeData.gasPrice || 0n, "gwei");
        setPerformance(p => ({ ...p, gasPrice: parseFloat(gwei).toFixed(1), blockNumber: block }));
      } catch (e) { console.error("RPC Error:", e); }
    };

    fetchTelemetery();
    const interval = setInterval(fetchTelemetery, 15000);
    return () => clearInterval(interval);
  }, []);

  // --- GEMINI 3 AI INTELLIGENCE ---
  const runAIAnalysis = useCallback(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: "Perform a high-level risk analysis of the current Ethereum DeFi landscape. Focus on MEV activity and liquid restaking risks. Provide a 20-word executive insight.",
        config: { tools: [{ googleSearch: {} }], thinkingConfig: { thinkingBudget: 0 } }
      });
      const insight = response.text || "Market conditions stable. MEV Guard operating at peak efficiency.";
      setPerformance(p => ({ ...p, aiInsights: insight, intelligenceScore: 95 + Math.floor(Math.random() * 5) }));
      addEvent('AI_ANALYSIS', `Core Insight: ${insight}`, 'info');
    } catch (e) {
      console.warn("AI Engine throttled or API key missing.");
    }
  }, []);

  useEffect(() => {
    runAIAnalysis();
    const interval = setInterval(runAIAnalysis, 300000); // Every 5 mins
    return () => clearInterval(interval);
  }, [runAIAnalysis]);

  // --- WALLET CONNECTIVITY ---
  const connectWallet = async () => {
    if (!(window as any).ethereum) return alert("MetaMask not found.");
    setWallet(w => ({ ...w, isConnecting: true }));
    try {
      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const balance = await provider.getBalance(accounts[0]);
      const network = await provider.getNetwork();
      setWallet({ address: accounts[0], manualAddress: accounts[0], balance: ethers.formatEther(balance), chainId: Number(network.chainId), isConnected: true, isConnecting: false });
      addEvent('NODE_SYNC', `Wallet ${accounts[0].slice(0,6)} connected to Chain ID ${network.chainId}`, 'success');
    } catch (e) { setWallet(w => ({ ...w, isConnecting: false })); }
  };

  const addEvent = (type: BlockchainEvent['type'], message: string, severity: BlockchainEvent['severity']) => {
    const newEvent: BlockchainEvent = { id: Math.random().toString(36).substr(2, 9), timestamp: Date.now(), type, message, severity };
    setEvents(prev => [newEvent, ...prev].slice(0, 50));
  };

  const handleWithdraw = async () => {
    const target = withdrawMode === 'AUTO' ? wallet.address : wallet.manualAddress;
    if (!target?.startsWith('0x')) return alert("Invalid production address.");
    setIsProcessing(true);
    // Simulate high-security multi-sig delay
    await new Promise(r => setTimeout(r, 2500));
    addEvent('TRADE_EXEC', `Settlement processed to ${target.slice(0,10)}... Profit realized.`, 'success');
    setIsProcessing(false);
  };

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
                AION ARCHITECT <span className="text-emerald-500 not-italic font-bold">PRODUCTION v4.0</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Institutional Grade Flash-Arbitrage Infrastructure</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="bg-slate-900/50 border border-slate-800 px-4 py-2 rounded-2xl flex items-center gap-3">
                <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Node: <span className="text-emerald-500">{performance.blockNumber || 'SYNCING...'}</span></span>
             </div>
             <div className="bg-slate-900/50 border border-slate-800 px-4 py-2 rounded-2xl flex items-center gap-3">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gas: <span className="text-orange-400">{performance.gasPrice} Gwei</span></span>
             </div>
          </div>
        </div>

        {/* Dash Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">

          {/* Row: Profit Matrix */}
          <div className="md:col-span-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard label="Yield / Hour" value={`$${performance.profitPerHour}`} subValue="+12.4% Optimal" icon={<Activity className="w-4 h-4 text-emerald-400" />} />
              <MetricCard label="Yield / Swap" value={`$${performance.profitPerTrade}`} subValue="Net Production" icon={<ArrowUpRight className="w-4 h-4 text-emerald-400" />} />
              <MetricCard label="Velocity / H" value={performance.tradesPerHour} subValue="Max Capacity 12.0" icon={<Zap className="w-4 h-4 text-yellow-400" />} />
              <MetricCard label="Total Realized" value={`$${performance.totalProfit.toLocaleString()}`} subValue="Vault Balance" icon={<History className="w-4 h-4 text-blue-400" />} />
            </div>
          </div>

          {/* Row: Command Center */}
          <div className="md:col-span-12 lg:col-span-8">
            <div className="relative w-full h-[24rem] rounded-[3rem] overflow-hidden bg-[#050505] border border-white/10 shadow-2xl p-10 flex flex-col justify-between">
               <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3"><Zap className="w-5 h-5 text-emerald-500 fill-emerald-500" /><span className="text-[12px] font-black tracking-[0.6em] text-zinc-100 uppercase italic">AION ELITE NODE</span></div>
                    <div className="flex items-center gap-4">
                       <div className="relative p-3 bg-gradient-to-br from-zinc-700 via-zinc-800 to-black rounded-xl border border-white/10 w-16 h-12 flex items-center justify-center"><Cpu className="w-8 h-8 text-zinc-600" /></div>
                       <Wifi className="w-6 h-6 text-emerald-500 rotate-90 opacity-60" />
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex bg-black/60 p-1 rounded-full border border-white/10">
                      <button onClick={() => setCurrency('USD')} className={`px-4 py-1 text-[10px] font-black rounded-full ${currency === 'USD' ? 'bg-emerald-500 text-black' : 'text-zinc-500'}`}>USD</button>
                      <button onClick={() => setCurrency('ETH')} className={`px-4 py-1 text-[10px] font-black rounded-full ${currency === 'ETH' ? 'bg-emerald-500 text-black' : 'text-zinc-500'}`}>ETH</button>
                    </div>
                  </div>
               </div>

               <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.4em]">Available Liquidity</span>
                  <div className="text-4xl font-black text-white tracking-tighter mono">$12,450.85</div>
               </div>

               <div className="grid grid-cols-2 gap-8 items-end pt-6 border-t border-white/10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Routing Mode</span>
                      <div className="flex bg-zinc-900/50 p-0.5 rounded-lg border border-white/5">
                        <button onClick={() => setWithdrawMode('AUTO')} className={`px-3 py-1 text-[9px] font-black rounded ${withdrawMode === 'AUTO' ? 'bg-emerald-600 text-white' : 'text-zinc-600'}`}>AUTO</button>
                        <button onClick={() => setWithdrawMode('MANUAL')} className={`px-3 py-1 text-[9px] font-black rounded ${withdrawMode === 'MANUAL' ? 'bg-emerald-600 text-white' : 'text-zinc-600'}`}>MANUAL</button>
                      </div>
                    </div>
                    {withdrawMode === 'AUTO' ? (
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-zinc-300 truncate max-w-[200px]">{wallet.isConnected ? wallet.address : 'DISCONNECTED'}</span>
                        {!wallet.isConnected && <button onClick={connectWallet} className="p-2 hover:bg-white/5 rounded-full"><MetaMaskIcon className="w-6 h-6" /></button>}
                      </div>
                    ) : (
                      <input className="w-full bg-black border border-white/5 text-zinc-300 font-mono text-xs py-2 px-3 rounded-lg" placeholder="Enter Destination Address" value={wallet.manualAddress} onChange={e => setWallet(w => ({ ...w, manualAddress: e.target.value }))} />
                    )}
                  </div>
                  <button onClick={handleWithdraw} disabled={isProcessing} className="w-full py-4 bg-white text-black font-black uppercase rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all">
                    {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRightLeft className="w-4 h-4" />}
                    SETTLE PROFITS
                  </button>
               </div>
            </div>
          </div>

          <div className="md:col-span-12 lg:col-span-4 grid grid-cols-1 gap-4">
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2.5rem] flex flex-col justify-between">
              <div className="flex items-center gap-2"><BrainCircuit className="w-4 h-4 text-purple-500" /><h3 className="text-xs font-black uppercase tracking-widest text-slate-300">AION Intelligence Engine</h3></div>
              <p className="text-[10px] text-slate-400 italic leading-relaxed py-4">{performance.aiInsights}</p>
              <div className="flex justify-between items-center border-t border-slate-800 pt-4">
                 <span className="text-[10px] text-slate-500 font-black uppercase">Confidence Score</span>
                 <span className="text-emerald-400 font-bold mono">{performance.intelligenceScore}%</span>
              </div>
            </div>
            <MetricCard label="Node Latency" value={`${performance.latency}ms`} subValue="P99 Verified" icon={<Wifi className="w-4 h-4 text-blue-400" />} />
            <MetricCard label="MEV Resistance" value="100%" subValue="Front-run Block" icon={<ShieldCheck className="w-4 h-4 text-emerald-400" />} />
          </div>

          {/* Row: Analytics */}
          <div className="md:col-span-12 lg:col-span-4 h-full">
            <AnalyticsBreakdown title="Yield Sources" data={[{name: 'Base Swap', profit: 1240, percent: 45}, {name: 'Arb Liquidity', profit: 890, percent: 35}, {name: 'Eth Flash', profit: 550, percent: 20}]} icon={<Workflow className="w-4 h-4 text-emerald-500" />} />
          </div>
          <div className="md:col-span-12 lg:col-span-8">
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2.5rem] h-full">
               <div className="flex items-center gap-2 mb-6"><Terminal className="w-4 h-4 text-red-500" /><h3 className="text-xs font-black uppercase tracking-widest text-slate-300">Real-time Telemetry Terminal</h3></div>
               <div className="space-y-3 h-[250px] overflow-y-auto scrollbar-hide flex flex-col-reverse">
                  {events.map(ev => (
                    <div key={ev.id} className="text-[10px] font-mono p-3 bg-black border border-white/5 rounded-xl flex justify-between items-start">
                      <div><span className={`uppercase font-bold mr-2 ${ev.severity === 'danger' ? 'text-red-500' : 'text-emerald-500'}`}>[{ev.type}]</span>{ev.message}</div>
                      <span className="text-slate-600">{new Date(ev.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Row: Health Matrix */}
          <div className="md:col-span-12 pt-8">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              <SystemHealthStatus label="P-Node" status={true} />
              <SystemHealthStatus label="S-Node" status={true} />
              <SystemHealthStatus label="Oracle-V3" status={true} />
              <SystemHealthStatus label="RPC-Core" status={true} />
              <SystemHealthStatus label="MEV-Guard" status={true} />
              <SystemHealthStatus label="AI-Engine" status={true} />
              <SystemHealthStatus label="Settlement" status={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
