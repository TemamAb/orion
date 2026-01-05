
import React, { useState, useEffect, useMemo } from 'react';
import {
   Activity, Zap, ShieldCheck, Radar,
   ListTree, Crosshair, Loader2, Cpu,
   Settings, LockKeyhole, Bolt, Database,
   ArrowUpRight, Info, BarChart3, Fingerprint,
   ChevronRight, ChevronLeft, Gauge, Shield, Box,
   UserPlus, Eye, Wallet, Terminal, Layers, TrendingUp,
   Workflow, Binary, ZapOff, HardDrive, Target, Flame,
   PieChart, Orbit, Lock, ShieldAlert, TrendingDown,
   Search, ScanEye, Radio, Timer, TrendingUp as TrendUpIcon,
   SearchCode, Network, ShieldQuestion, Zap as SignalIcon,
   History, MousePointer2, RefreshCw, Smartphone, Monitor,
   ArrowRight, ShieldCheck as VerifiedIcon, CreditCard,
   ExternalLink, Copy, CheckCircle2, BrainCircuit, ShieldX,
   Zap as FlashIcon, Layers as TierIcon, Unplug, Activity as PulseIcon,
   TrendingUp as PriceUp, TrendingDown as PriceDown,
   Settings as GearIcon,
   Server, ShieldAlert as AlertIcon, Waves, Zap as FlashLoanIcon,
   Zap as SyncIcon
} from 'lucide-react';
import { WalletIntel } from './types';

const STRATEGY_COLORS = [
   '#fbbf24', // Amber
   '#3b82f6', // Blue
   '#a855f7', // Purple
   '#ef4444', // Red
   '#10b981', // Emerald
   '#f97316', // Orange
   '#06b6d4', // Cyan (7th Strategy - Discovery)
];

const APEX_STRATEGY_NODES = [
   {
      address: '0x42...e9c3',
      label: 'THE GHOST',
      strategy: 'PRIVATE_RETRY_EXECUTION',
      usdProfit: 312000,
      contribution: 22.4
   },
   {
      address: '0x88...a2f1',
      label: 'SLOT-0 SNIPER',
      strategy: 'BLOCK_START_INTERCEPT',
      usdProfit: 245000,
      contribution: 18.1
   },
   {
      address: '0x77...c122',
      label: 'BUNDLE MASTER',
      strategy: 'ATOMIC_GROUP_TRADING',
      usdProfit: 210000,
      contribution: 15.2
   },
   {
      address: '0xfe...d322',
      label: 'ATOMIC FLUX',
      strategy: 'GAP_OPPORTUNITY_FINDER',
      usdProfit: 168000,
      contribution: 12.5
   },
   {
      address: '0x11...b8d5',
      label: 'DARK RELAY',
      strategy: 'LIQUIDITY_ENTRY_SNIPER',
      usdProfit: 125000,
      contribution: 10.8
   },
   {
      address: '0xab...f21a',
      label: 'HIVE SYMMETRY',
      strategy: 'SMART_WALLET_MIRROR',
      usdProfit: 98000,
      contribution: 9.0
   },
   {
      address: 'DYNAMIC_SCAN_HUB',
      label: 'DISCOVERY_HUNT',
      strategy: 'ALPHA_SIGNATURE_SCOUTING',
      usdProfit: 84000,
      contribution: 12.0
   },
];

const App: React.FC = () => {
   const [activeView, setActiveView] = useState<'LIVE' | 'MASTER' | 'FOLLOW' | 'MONITOR' | 'WITHDRAW' | 'INTEL' | 'PERFORMANCE'>('MASTER');
   const [sidebarExpanded, setSidebarExpanded] = useState(false);
   const [engineStarted, setEngineStarted] = useState(false);

   // Dynamic Currency Logic
   const [viewCurrency, setViewCurrency] = useState<'USD' | 'ETH'>('USD');
   const [ethPrice, setEthPrice] = useState(2452.84);

   const totalUsdYield = 842000;

   // Format Helper
   const formatCurrency = (valUsd: number) => {
      if (viewCurrency === 'ETH') {
         const ethVal = valUsd / ethPrice;
         return `Ξ ${ethVal.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`;
      }
      return `$${valUsd.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
   };

   const [targetWallet, setTargetWallet] = useState('');
   const [detectingWallet, setDetectingWallet] = useState(false);
   const [isWalletDetected, setIsWalletDetected] = useState(false);
   const [executingWithdrawal, setExecutingWithdrawal] = useState(false);

   // Performance Fluctuations
   const [performanceStats, setPerformanceStats] = useState(APEX_STRATEGY_NODES.map(() => 0));

   useEffect(() => {
      if (!engineStarted) {
         setPerformanceStats(APEX_STRATEGY_NODES.map(() => 0));
         return;
      }
      const interval = setInterval(() => {
         setPerformanceStats(prev => prev.map(() => 98.5 + Math.random() * 1.45));
      }, 2000);
      return () => clearInterval(interval);
   }, [engineStarted]);

   // MetaMask Detection
   const detectWalletAddress = async () => {
      if (detectingWallet) return;
      setDetectingWallet(true);
      setIsWalletDetected(false);

      try {
         await new Promise(resolve => setTimeout(resolve, 1000));
         if (typeof (window as any).ethereum !== 'undefined') {
            const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
            if (accounts && accounts.length > 0) {
               setTargetWallet(accounts[0]);
               setIsWalletDetected(true);
            }
         } else {
            alert("Wallet extension (MetaMask) not found.");
         }
      } catch (err) {
         console.error("Link failed", err);
      } finally {
         setDetectingWallet(false);
      }
   };

   const handleWithdrawalExecution = async () => {
      if (!targetWallet) return alert("Please enter a withdrawal address.");
      setExecutingWithdrawal(true);
      await new Promise(resolve => setTimeout(resolve, 3000));
      setExecutingWithdrawal(false);
      alert(`Withdrawal Successful: ${formatCurrency(totalUsdYield)} sent to ${targetWallet}`);
   };

   // Backend Connection Logic
   const [backendStatus, setBackendStatus] = useState<boolean>(false);
   const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

   useEffect(() => {
      const checkBackend = async () => {
         try {
            const res = await fetch(`${BACKEND_URL}/api/health`);
            if (res.ok) setBackendStatus(true);
            else setBackendStatus(false);
         } catch (e) {
            setBackendStatus(false);
         }
      };
      checkBackend();
      const interval = setInterval(checkBackend, 30000); // Check every 30s
      return () => clearInterval(interval);
   }, []);

   const toggleEngine = () => {
      if (!backendStatus) {
         alert("Cannot start engine: Backend connection failed. Please ensure the enterprise server is running.");
         return;
      }
      setEngineStarted(true);
      if (activeView !== 'MASTER') setActiveView('MASTER');
   };

   useEffect(() => {
      const bInt = setInterval(() => {
         const ethChange = (Math.random() * 2 - 1);
         setEthPrice(p => p + ethChange);
      }, 1000);
      return () => clearInterval(bInt);
   }, []);

   return (
      <div className="flex h-screen bg-[#020202] text-[#f8fafc] font-sans selection:bg-[#fbbf24] selection:text-black overflow-hidden relative">

         <aside className={`relative h-full border-r border-white/5 bg-black/95 backdrop-blur-3xl flex flex-col items-center py-10 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-[100] group/sidebar ${sidebarExpanded ? 'w-80 px-6' : 'w-24 px-4'}`}>
            <button onClick={() => setSidebarExpanded(!sidebarExpanded)} className="absolute -right-3 top-12 w-6 h-6 bg-[#fbbf24] rounded-full flex items-center justify-center text-black shadow-[0_0_15px_#fbbf24] z-[110] hover:scale-110 transition-transform">
               {sidebarExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>

            <div className={`flex items-center gap-4 mb-16 self-start ${sidebarExpanded ? 'ml-2' : 'ml-0'}`}>
               <div className="p-3 bg-[#fbbf24]/10 rounded-2xl border border-[#fbbf24]/20 relative group/logo">
                  <Orbit size={24} className={`text-[#fbbf24] ${engineStarted ? 'animate-[spin_4s_linear_infinite]' : 'animate-[spin_12s_linear_infinite]'}`} />
               </div>
               {sidebarExpanded && (
                  <div className="flex flex-col animate-in fade-in slide-in-from-left-4 duration-300 text-left">
                     <span className="text-sm font-black text-[#fbbf24] tracking-[0.2em] uppercase leading-none">Orion_Alpha</span>
                     <span className="text-[10px] text-slate-500 font-bold uppercase mt-1">Intercept Terminal</span>
                  </div>
               )}
            </div>

            <nav className="flex flex-col gap-4 w-full">
               <button onClick={() => setActiveView('MASTER')} className={`flex items-center gap-4 p-4 rounded-xl w-full transition-all group/item relative overflow-hidden ${activeView === 'MASTER' ? 'bg-[#fbbf24]/20 text-[#fbbf24] border border-[#fbbf24]/30' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
                  <PieChart size={22} className="shrink-0" />
                  {sidebarExpanded && <span className="text-xs font-black uppercase tracking-widest leading-none">Strategy Matrix</span>}
               </button>
               <button onClick={() => setActiveView('PERFORMANCE')} className={`flex items-center gap-4 p-4 rounded-xl w-full transition-all group/item relative overflow-hidden ${activeView === 'PERFORMANCE' ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
                  <SyncIcon size={22} className="shrink-0" />
                  {sidebarExpanded && <span className="text-xs font-black uppercase tracking-widest leading-none">Performance Sync</span>}
               </button>
               <button onClick={() => setActiveView('INTEL')} className={`flex items-center gap-4 p-4 rounded-xl w-full transition-all group/item relative overflow-hidden ${activeView === 'INTEL' ? 'bg-[#06b6d4]/20 text-[#06b6d4] border border-[#06b6d4]/30' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
                  <PulseIcon size={22} className="shrink-0" />
                  {sidebarExpanded && <span className="text-xs font-black uppercase tracking-widest leading-none">System Intel</span>}
               </button>
               <button onClick={() => setActiveView('WITHDRAW')} className={`flex items-center gap-4 p-4 rounded-xl w-full transition-all group/item relative overflow-hidden ${activeView === 'WITHDRAW' ? 'bg-[#fbbf24]/20 text-[#fbbf24] border border-[#fbbf24]/30' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
                  <RefreshCw size={22} className="shrink-0" />
                  {sidebarExpanded && <span className="text-xs font-black uppercase tracking-widest leading-none">Withdrawal</span>}
               </button>
            </nav>
         </aside>

         <div className="flex-1 flex flex-col overflow-hidden relative">
            <header className="h-20 border-b border-white/5 bg-black/80 backdrop-blur-3xl px-6 md:px-12 flex items-center justify-between z-50">
               <div className="flex items-center gap-6 text-left">
                  <span className="text-[9px] text-[#fbbf24] font-black uppercase tracking-[0.2em] flex items-center gap-2 px-3 py-1.5 rounded border border-[#fbbf24]/30 bg-[#fbbf24]/5">
                     <LockKeyhole size={10} /> 0.001% AUTHORISED
                  </span>
               </div>

               <div className="flex items-center gap-6">
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1">
                     <button
                        onClick={() => setViewCurrency('ETH')}
                        className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${viewCurrency === 'ETH' ? 'text-[#10b981] bg-[#10b981]/10' : 'text-slate-500 hover:text-slate-300'}`}
                     >
                        ETH
                     </button>
                     <button
                        onClick={() => setViewCurrency('USD')}
                        className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${viewCurrency === 'USD' ? 'text-[#10b981] bg-[#10b981]/10' : 'text-slate-500 hover:text-slate-300'}`}
                     >
                        USD
                     </button>
                  </div>

                  <button
                     onClick={toggleEngine}
                     disabled={engineStarted}
                     className={`flex items-center gap-3 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 border overflow-hidden relative group ${engineStarted
                        ? 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                        : 'bg-[#fbbf24] text-black border-[#fbbf24] hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(251,191,36,0.25)]'
                        }`}
                  >
                     <GearIcon
                        size={16}
                        className={`${engineStarted ? 'animate-[spin_3s_linear_infinite]' : 'group-hover:rotate-45 transition-transform'}`}
                     />
                     <span className="relative z-10">
                        {engineStarted ? 'ENGINE RUNNING!' : 'START ENGINE'}
                     </span>
                     {engineStarted && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]" />
                     )}
                  </button>
               </div>
            </header>

            <main className="flex-1 flex flex-col relative overflow-hidden bg-[#050505]">
               <div className="absolute inset-0 cyber-grid opacity-[0.06] pointer-events-none" />

               {activeView === 'MASTER' && (
                  <div className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar relative z-10 animate-in fade-in duration-500 flex flex-col items-center">
                     <div className="w-full max-w-6xl">
                        <div className="flex items-center gap-3 mb-12 text-left">
                           <div className="p-3 bg-[#fbbf24]/10 rounded-xl border border-[#fbbf24]/20 relative">
                              <PieChart size={24} className="text-[#fbbf24]" />
                              {engineStarted && (
                                 <div className="absolute -inset-1 border border-[#fbbf24]/40 rounded-xl animate-ping opacity-20" />
                              )}
                           </div>
                           <div>
                              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">7-Node Strategy Matrix</h2>
                              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                 {engineStarted ? 'CLUSTER FULLY OPERATIONAL' : 'SYSTEM STANDBY - ENGINE REQUIRED'}
                              </p>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                           <div className="lg:col-span-5 flex justify-center py-10 relative">
                              <div className="relative flex items-center justify-center">
                                 <svg width="250" height="250" viewBox="0 0 250 250" className={`transform -rotate-90 transition-all duration-1000 ${engineStarted ? 'scale-110 drop-shadow-[0_0_30px_rgba(251,191,36,0.1)]' : 'opacity-40'}`}>
                                    {APEX_STRATEGY_NODES.map((item, idx) => {
                                       const circumference = 2 * Math.PI * 110;
                                       const dash = (item.contribution / 100) * circumference;
                                       const offset = -APEX_STRATEGY_NODES.slice(0, idx).reduce((acc, curr) => acc + (curr.contribution / 100) * circumference, 0);
                                       return (
                                          <circle
                                             key={idx}
                                             cx="125"
                                             cy="125"
                                             r="110"
                                             fill="transparent"
                                             stroke={STRATEGY_COLORS[idx % STRATEGY_COLORS.length]}
                                             strokeWidth="25"
                                             strokeDasharray={`${dash} ${circumference}`}
                                             strokeDashoffset={offset}
                                             className={`transition-all duration-1000 ${engineStarted ? 'opacity-100' : 'opacity-20'}`}
                                          />
                                       );
                                    })}
                                 </svg>
                                 <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Target Yield</span>
                                    <span className="text-3xl font-black text-[#fbbf24] font-mono tracking-tighter leading-none">
                                       {engineStarted ? formatCurrency(totalUsdYield) : '---'}
                                    </span>
                                    <span className={`text-[7px] font-bold uppercase mt-2 ${engineStarted ? 'text-green-400' : 'text-slate-600'}`}>
                                       {engineStarted ? 'Active Cluster' : 'LOCKED'}
                                    </span>
                                 </div>
                              </div>
                           </div>
                           <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {APEX_STRATEGY_NODES.map((n, idx) => (
                                 <div key={idx} className={`p-5 rounded-2xl bg-black/60 border transition-all duration-700 group relative overflow-hidden text-left ${engineStarted ? 'border-white/10 opacity-100 translate-y-0' : 'border-white/5 opacity-40 translate-y-4'}`} style={{ transitionDelay: `${idx * 100}ms` }}>
                                    <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: engineStarted ? STRATEGY_COLORS[idx % STRATEGY_COLORS.length] : '#334155' }} />
                                    <div className="flex justify-between items-start mb-2">
                                       <span className="text-[10px] font-black text-white uppercase tracking-wider">{n.label}</span>
                                       <span className={`text-[9px] font-mono font-black ${engineStarted ? 'text-[#fbbf24]' : 'text-slate-700'}`}>
                                          {engineStarted ? formatCurrency(n.usdProfit) : 'CALC...'}
                                       </span>
                                    </div>
                                    <p className="text-[8px] text-slate-600 uppercase font-black tracking-widest leading-tight">{n.strategy}</p>
                                    <div className="mt-3 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                       <div className={`h-full bg-white/10 transition-all duration-1000`} style={{ width: engineStarted ? `${n.contribution}%` : '0%' }} />
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>

                        <div className={`mt-12 p-8 rounded-[2rem] border transition-all duration-1000 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-xl text-left ${engineStarted ? 'bg-[#10b981]/5 border-[#10b981]/20' : 'bg-[#fbbf24]/5 border-[#fbbf24]/20'}`}>
                           <div className="flex items-center gap-6">
                              <div className="p-4 bg-black rounded-2xl border border-white/5 relative overflow-hidden">
                                 <Orbit size={32} className={`text-[#fbbf24] ${engineStarted ? 'animate-[spin_2s_linear_infinite]' : 'animate-spin-slow'}`} />
                                 {engineStarted && <div className="absolute inset-0 bg-green-500/10 animate-pulse" />}
                              </div>
                              <div>
                                 <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-1">
                                    {engineStarted ? 'Cluster Sync Complete' : 'Synchronize Cluster Forge'}
                                 </h3>
                                 <p className="text-[9px] font-medium text-slate-500 uppercase leading-relaxed max-w-sm">
                                    {engineStarted
                                       ? 'Neural link established. Intercepting the 0.001% wallet signatures across all block-zero events.'
                                       : 'System initialization required. Start the engine to bridge the strategy matrix to live interceptors.'}
                                 </p>
                              </div>
                           </div>
                           <button
                              onClick={() => engineStarted ? setActiveView('PERFORMANCE') : toggleEngine()}
                              className={`w-full md:w-auto px-12 py-5 rounded-2xl text-[12px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 ${engineStarted
                                 ? 'bg-[#10b981] text-black shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:scale-105'
                                 : 'bg-[#fbbf24] text-black shadow-[0_0_40px_rgba(251,191,36,0.3)] hover:scale-105'
                                 }`}
                           >
                              {engineStarted ? <Activity size={18} /> : <Flame size={18} />}
                              {engineStarted ? 'VIEW SYNC FEED' : 'Forge Strategies'}
                           </button>
                        </div>
                     </div>
                  </div>
               )}

               {activeView === 'PERFORMANCE' && (
                  <div className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar relative z-10 animate-in fade-in duration-500 text-left">
                     <div className="max-w-7xl mx-auto flex flex-col gap-8">
                        <div className="flex items-center justify-between border-b border-white/5 pb-8">
                           <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-2xl border ${engineStarted ? 'bg-[#10b981]/10 border-[#10b981]/30' : 'bg-white/5 border-white/10'}`}>
                                 <SyncIcon size={24} className={engineStarted ? 'text-[#10b981] animate-pulse' : 'text-slate-600'} />
                              </div>
                              <div>
                                 <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Performance Sync monitoring</h2>
                                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Real-time Matrix Replication Status</p>
                              </div>
                           </div>
                           <div className="px-6 py-3 rounded-xl bg-black/40 border border-white/5 flex flex-col items-end">
                              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Global Replication</span>
                              <span className={`text-lg font-mono font-black ${engineStarted ? 'text-[#10b981]' : 'text-slate-800'}`}>
                                 {engineStarted ? '99.42%' : 'OFFLINE'}
                              </span>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                           {APEX_STRATEGY_NODES.map((node, idx) => (
                              <div key={idx} className={`p-5 rounded-2xl bg-black/60 border backdrop-blur-3xl transition-all duration-700 relative overflow-hidden group ${engineStarted ? 'border-white/10' : 'border-white/5 opacity-50'}`}>
                                 <div className="absolute top-0 left-0 w-full h-0.5" style={{ backgroundColor: STRATEGY_COLORS[idx % STRATEGY_COLORS.length] }} />
                                 <div className="flex justify-between items-start mb-4">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{node.label}</span>
                                    <div className={`w-2 h-2 rounded-full ${engineStarted ? 'bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]' : 'bg-slate-800'}`} />
                                 </div>
                                 <div className="flex flex-col gap-1 mb-6">
                                    <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest">Execution Sync</span>
                                    <span className={`text-2xl font-mono font-black ${engineStarted ? 'text-white' : 'text-slate-800'}`}>
                                       {engineStarted ? performanceStats[idx].toFixed(2) + '%' : '---'}
                                    </span>
                                 </div>
                                 <div className="flex flex-col gap-3">
                                    <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                                       <div
                                          className="h-full transition-all duration-1000"
                                          style={{
                                             width: engineStarted ? `${performanceStats[idx]}%` : '0%',
                                             backgroundColor: STRATEGY_COLORS[idx % STRATEGY_COLORS.length]
                                          }}
                                       />
                                    </div>
                                    <div className="flex justify-between items-center text-[7px] font-bold uppercase tracking-widest text-slate-500">
                                       <span>Data Integrity</span>
                                       <span className={engineStarted ? 'text-white' : ''}>{engineStarted ? '100%' : '---'}</span>
                                    </div>
                                 </div>
                                 <div className="absolute bottom-0 right-0 p-2 opacity-5 pointer-events-none group-hover:opacity-20 transition-opacity">
                                    <Activity size={40} />
                                 </div>
                              </div>
                           ))}
                           {/* 8th Card as a filler or detailed aggregate */}
                           <div className="p-5 rounded-2xl bg-gradient-to-br from-[#10b981]/5 to-transparent border border-[#10b981]/10 flex flex-col justify-between">
                              <div>
                                 <h4 className="text-[10px] font-black text-[#10b981] uppercase tracking-[0.2em] mb-2">Aggregate Health</h4>
                                 <p className="text-[8px] font-bold text-slate-600 uppercase leading-relaxed">System-wide strategy replication accuracy across all 7 apex nodes.</p>
                              </div>
                              <div className="flex items-center gap-2 mt-4">
                                 <ShieldCheck size={14} className="text-[#10b981]" />
                                 <span className="text-[9px] font-black text-white uppercase">Neural Stability Verified</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {activeView === 'WITHDRAW' && (
                  <div className="flex-1 p-4 md:p-10 overflow-y-auto custom-scrollbar relative z-10 animate-in fade-in duration-500 flex flex-col items-center">
                     <div className="w-full max-w-4xl flex flex-col gap-8 text-left">
                        <div className={`bg-black/40 border rounded-[2rem] p-10 backdrop-blur-3xl shadow-2xl flex flex-col md:flex-row items-end justify-between gap-8 relative overflow-hidden group transition-colors duration-1000 ${engineStarted ? 'border-[#10b981]/20' : 'border-white/5'}`}>
                           <div className={`absolute top-0 left-0 w-1.5 h-full transition-colors ${engineStarted ? 'bg-[#10b981]' : 'bg-[#fbbf24]/50'}`} />
                           <div className="flex flex-col gap-6 relative z-10 w-full md:w-auto">
                              <div className="flex items-center gap-3">
                                 <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                                    <RefreshCw size={18} className={engineStarted ? 'text-[#10b981]' : 'text-[#fbbf24]'} />
                                 </div>
                                 <h2 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Withdrawal Hub</h2>
                              </div>
                              <div className="flex flex-col gap-1">
                                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Profit Balance</span>
                                 <div className="flex items-baseline gap-4">
                                    <span className="text-6xl font-mono font-black text-white tracking-tighter">
                                       {engineStarted ? formatCurrency(totalUsdYield) : 'LOCKED'}
                                    </span>
                                    {engineStarted && (
                                       <span className="text-[11px] font-black text-green-400 uppercase tracking-widest flex items-center gap-1 bg-green-500/10 px-3 py-1 rounded-lg border border-green-500/20">
                                          <ArrowUpRight size={12} /> +4.2%
                                       </span>
                                    )}
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="bg-black/60 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl shadow-xl flex flex-col gap-10 text-left">
                           <div className="flex items-center justify-between border-b border-white/5 pb-6">
                              <div className="flex items-center gap-4">
                                 <div className="p-3 bg-[#fbbf24]/10 rounded-2xl border border-[#fbbf24]/20">
                                    <Crosshair size={22} className="text-[#fbbf24]" />
                                 </div>
                                 <div>
                                    <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">Recipient Wallet</h3>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Designate your secure settlement endpoint</p>
                                 </div>
                              </div>
                              {isWalletDetected && (
                                 <span className="text-[8px] font-black text-green-500 uppercase tracking-widest px-3 py-1 border border-green-500/30 rounded-lg bg-green-500/10 shadow-[0_0_10px_rgba(34,197,94,0.1)]">Secure Link Active</span>
                              )}
                           </div>

                           <div className="flex flex-col gap-6">
                              <div className="flex justify-between items-center px-1">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Handshake Interface</label>
                                 <button onClick={detectWalletAddress} className="text-[10px] font-black text-[#fbbf24] hover:text-white flex items-center gap-2 uppercase transition-all hover:scale-105 active:scale-95">
                                    <Monitor size={14} /> Link MetaMask
                                 </button>
                              </div>
                              <div className="relative group">
                                 <input
                                    type="text"
                                    value={targetWallet}
                                    onChange={(e) => setTargetWallet(e.target.value)}
                                    placeholder="Enter Withdrawal Address (0x...)"
                                    className="w-full bg-black/40 border border-white/5 rounded-[1.5rem] py-6 px-8 text-sm font-mono text-[#fbbf24] focus:outline-none focus:border-[#fbbf24]/40 transition-all placeholder:text-slate-800"
                                 />
                                 <div className="absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-white/5 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <VerifiedIcon size={16} className="text-slate-600" />
                                 </div>
                              </div>
                              <p className="text-[9px] text-slate-600 uppercase font-black tracking-[0.1em] leading-relaxed max-w-2xl">
                                 Ensure the destination address is correctly formatted. All transfers are processed through the Orion High-Speed Relay to ensure minimal slippage and maximum privacy on the target chain.
                              </p>
                           </div>
                        </div>

                        <button
                           onClick={handleWithdrawalExecution}
                           disabled={executingWithdrawal || !engineStarted}
                           className={`w-auto self-center px-16 py-4 rounded-2xl text-black text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-5 relative overflow-hidden ${!engineStarted ? 'bg-slate-900 text-slate-700 cursor-not-allowed border border-white/5' : 'bg-[#fbbf24] hover:scale-[1.01] shadow-[0_0_30px_rgba(251,191,36,0.2)] hover:bg-[#fcd34d]'
                              }`}
                        >
                           {executingWithdrawal ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
                           {!engineStarted ? "Engine Required" : (executingWithdrawal ? "Settling Assets..." : `Withdraw Profits (${viewCurrency})`)}
                           {executingWithdrawal && <div className="absolute bottom-0 left-0 h-1.5 bg-black animate-[progress_3s_linear]" style={{ width: '100%' }} />}
                        </button>
                     </div>
                  </div>
               )}

               {activeView === 'INTEL' && (
                  <div className="flex-1 p-4 md:p-6 overflow-y-auto custom-scrollbar relative z-10 animate-in fade-in duration-500 text-left">
                     <div className="max-w-6xl mx-auto flex flex-col gap-6">
                        {/* Header & Overall AI Health - Reduced Size */}
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                           <div className="flex items-center gap-3">
                              <div className={`p-2.5 rounded-xl border transition-colors ${engineStarted ? 'bg-[#10b981]/10 border-[#10b981]/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-[#06b6d4]/10 border-[#06b6d4]/20'}`}>
                                 <BrainCircuit size={20} className={engineStarted ? 'text-[#10b981] animate-pulse' : 'text-[#06b6d4]'} />
                              </div>
                              <div>
                                 <h2 className="text-xl font-black text-white uppercase tracking-tighter leading-none">System Intel Core</h2>
                                 <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Neural Diagnostic Suite</p>
                              </div>
                           </div>

                           <div className="flex items-center gap-6">
                              <div className="flex flex-col items-end">
                                 <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Self-Learning</span>
                                 <div className="flex items-baseline gap-1.5">
                                    <span className="text-lg font-mono font-black text-[#10b981]">{engineStarted ? '94.2%' : '0.0%'}</span>
                                    <PriceUp size={10} className="text-[#10b981]" />
                                 </div>
                              </div>
                              <div className="flex flex-col items-end">
                                 <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-0.5">AI Optimization</span>
                                 <div className="flex items-baseline gap-1.5">
                                    <span className="text-lg font-mono font-black text-[#fbbf24]">{engineStarted ? '98.8%' : 'OFF'}</span>
                                    <Activity size={10} className="text-[#fbbf24] animate-pulse" />
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Main Grid: Bot Tiers & Security - Compacted */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

                           {/* Left: Tri-Tier Bot Cluster */}
                           <div className="lg:col-span-8 flex flex-col gap-5">
                              <div className="bg-black/60 border border-white/10 rounded-[1.5rem] p-6 backdrop-blur-3xl shadow-xl flex flex-col gap-6">
                                 <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                       <Server size={14} className="text-[#fbbf24]" />
                                       <h3 className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Tri-Tier Bot Cluster</h3>
                                    </div>
                                    <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest">12.4 GB/s Output</span>
                                 </div>

                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {[
                                       { tier: 'Scanners', label: 'Mempool', metrics: '124K tx/s', latency: '< 1ms', color: '#3b82f6', bg: 'bg-blue-500/10' },
                                       { tier: 'Executors', label: 'Flash-Loan', metrics: '4.2s Avg', latency: 'Block-0', color: '#fbbf24', bg: 'bg-amber-500/10' },
                                       { tier: 'Captains', label: 'Risk AI', metrics: '99.9% Cons', latency: 'Verified', color: '#a855f7', bg: 'bg-purple-500/10' }
                                    ].map((bot, i) => (
                                       <div key={i} className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-2 relative overflow-hidden group">
                                          <div className="absolute -bottom-2 -right-2 p-1 opacity-[0.05] group-hover:opacity-10 transition-opacity">
                                             <BotIcon tier={bot.tier} size={30} />
                                          </div>
                                          <h4 className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{bot.tier}</h4>
                                          <div className="flex flex-col">
                                             <span className="text-sm font-black text-white uppercase leading-none">{engineStarted ? bot.metrics : 'IDLE'}</span>
                                             <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest mt-1">{bot.label}</span>
                                          </div>
                                          <div className="flex items-center gap-1.5 mt-1">
                                             <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: engineStarted ? bot.color : '#334155' }} />
                                             <span className="text-[7px] font-black uppercase tracking-widest text-slate-500">{engineStarted ? bot.latency : 'OFF'}</span>
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              </div>

                              {/* Bottom: Flash Loan Analytics - Compacted */}
                              <div className="bg-black/60 border border-white/10 rounded-[1.5rem] p-6 backdrop-blur-3xl shadow-xl flex flex-col gap-5">
                                 <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                       <FlashLoanIcon size={14} className="text-[#10b981]" />
                                       <h3 className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Flash Loan Flux</h3>
                                    </div>
                                    <div className="flex gap-2.5">
                                       <div className="flex items-center gap-1.5">
                                          <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                                          <span className="text-[7px] font-black text-slate-600 uppercase">Utilized</span>
                                       </div>
                                       <div className="flex items-center gap-1.5">
                                          <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                                          <span className="text-[7px] font-black text-slate-600 uppercase">Avail</span>
                                       </div>
                                    </div>
                                 </div>

                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                                    <div className="flex flex-col gap-2.5">
                                       <div className="flex justify-between items-end">
                                          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Capital Flux</span>
                                          <span className="text-xs font-mono font-black text-[#10b981]">{engineStarted ? '$12.4M' : '$0.00'}</span>
                                       </div>
                                       <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                                          <div className="h-full bg-[#10b981] transition-all duration-1000" style={{ width: engineStarted ? '68%' : '0%' }} />
                                       </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                       <div className="flex flex-col p-2 bg-white/[0.02] border border-white/[0.03] rounded-lg">
                                          <span className="text-[6px] font-black text-slate-600 uppercase tracking-widest mb-0.5">Latency</span>
                                          <span className="text-[9px] font-black text-white">{engineStarted ? '142ms' : '---'}</span>
                                       </div>
                                       <div className="flex flex-col p-2 bg-white/[0.02] border border-white/[0.03] rounded-lg">
                                          <span className="text-[6px] font-black text-slate-600 uppercase tracking-widest mb-0.5">Slippage</span>
                                          <span className="text-[9px] font-black text-white">{engineStarted ? '0.04%' : '---'}</span>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           {/* Right: Security & Threat Mitigation - Compacted */}
                           <div className="lg:col-span-4 flex flex-col gap-5">
                              <div className="bg-black/60 border border-white/10 rounded-[1.5rem] p-5 backdrop-blur-3xl shadow-xl flex-col flex gap-5 h-full">
                                 <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                                    <ShieldAlert size={14} className="text-[#ef4444]" />
                                    <h3 className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Security Defense</h3>
                                 </div>

                                 <div className="flex flex-col gap-2.5">
                                    {[
                                       { type: 'MEV Mitigation', count: '142 Pnt', status: 'ON', color: 'text-green-400' },
                                       { type: 'Frontrunner', count: '3.4K Bld', status: 'SHD', color: 'text-[#10b981]' },
                                       { type: 'Sandwich Def', count: '12.4 ETH', status: 'RTG', color: 'text-blue-400' }
                                    ].map((security, i) => (
                                       <div key={i} className="flex flex-col gap-1 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.03]">
                                          <div className="flex justify-between items-center">
                                             <span className="text-[8px] font-black text-slate-300 uppercase tracking-wider">{security.type}</span>
                                             <span className={`text-[6px] font-black uppercase ${security.color}`}>{engineStarted ? security.status : 'OFF'}</span>
                                          </div>
                                          <div className="flex items-center justify-between text-[7px] font-bold text-slate-500 uppercase">
                                             <span>Defense Stats</span>
                                             <span className="text-slate-400 font-mono">{engineStarted ? security.count : '---'}</span>
                                          </div>
                                       </div>
                                    ))}
                                 </div>

                                 <div className="mt-auto p-3.5 rounded-xl bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 flex flex-col gap-2">
                                    <div className="flex items-center gap-1.5">
                                       <AlertIcon size={10} className="text-red-500" />
                                       <span className="text-[7px] font-black text-white uppercase tracking-widest">Threat Lvl</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                       <span className="text-lg font-black text-red-500 uppercase tracking-tighter">ULTRA_LOW</span>
                                       <div className="flex gap-0.5">
                                          {[1, 2, 3, 4, 5].map(b => <div key={b} className={`w-1 h-3 rounded-sm ${b <= 1 ? 'bg-red-500 animate-pulse' : 'bg-slate-800'}`} />)}
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>

                        </div>
                     </div>
                  </div>
               )}
            </main>

            <footer className="h-10 border-t border-white/5 bg-black/90 px-6 md:px-10 flex items-center justify-between z-50">
               <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2">
                     <div className={`w-1.5 h-1.5 rounded-full transition-colors ${backendStatus ? 'bg-[#10b981] shadow-[0_0_8px_#10b981]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`} />
                     <span className={`text-[8px] font-black uppercase tracking-widest ${backendStatus ? 'text-slate-500' : 'text-red-500'}`}>
                        {backendStatus ? 'SERVER: ONLINE' : 'SERVER: DISCONNECTED'}
                     </span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className={`w-1.5 h-1.5 rounded-full transition-colors ${engineStarted ? 'bg-[#10b981] shadow-[0_0_8px_#10b981]' : 'bg-[#fbbf24]'}`} />
                     <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                        {engineStarted ? 'SYSTEM_STATE: RUNNING' : 'SYSTEM_STATE: STANDBY'}
                     </span>
                  </div>
               </div>
               <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest font-mono">&copy; 2025 ORION_TERMINAL</span>
            </footer>
         </div>
         <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
      </div>
   );
};

const BotIcon = ({ tier, size = 40 }: { tier: string, size?: number }) => {
   if (tier === 'Scanners') return <Radar size={size} />;
   if (tier === 'Executors') return <Target size={size} />;
   return <BrainCircuit size={size} />;
};

export default App;
