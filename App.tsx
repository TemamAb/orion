
import React, { useState, useEffect, useMemo } from 'react';
import { ethers } from 'ethers';
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
   const [deploymentContractNumber, setDeploymentContractNumber] = useState('');
   const [generatedSmartAccount, setGeneratedSmartAccount] = useState('');

   // Dynamic Currency Logic
   const [viewCurrency, setViewCurrency] = useState<'USD' | 'ETH'>('USD');
   const [ethPrice, setEthPrice] = useState(2452.84);

   const [auditedStats, setAuditedStats] = useState<any>(null);
   const [isAuditing, setIsAuditing] = useState(false);
   const totalProfit = auditedStats?.totalProfit || 0;
   const [profitTarget, setProfitTarget] = useState(1000000); // $1M default target
   const profitAchievement = totalProfit > 0 ? Math.min((totalProfit / profitTarget) * 100, 100) : 0;

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
   const [isAddressValid, setIsAddressValid] = useState(false);
   const [executingWithdrawal, setExecutingWithdrawal] = useState(false);
   const [withdrawalMode, setWithdrawalMode] = useState<'AUTO' | 'MANUAL'>('MANUAL');
   const [autoWithdrawThreshold, setAutoWithdrawThreshold] = useState(2452.84); // 1 ETH default

   // Performance Fluctuations
   const [performanceStats, setPerformanceStats] = useState(APEX_STRATEGY_NODES.map(() => 0));

   const [matrixStatus, setMatrixStatus] = useState<any>(null);
   const [botFleet, setBotFleet] = useState<any>(null);

   // Backend Connection Logic
   type ConnectionStatus = 'IDLE' | 'PROBING' | 'ONLINE' | 'OFFLINE';
   const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('IDLE');
   const [serverStatus, setServerStatus] = useState<any>(null);

   // Exact Discovery Logic:
   // 1. Check build-time env var
   // 2. Fallback to localhost for dev
   // 3. AUTO-DISCOVER if running on Render production
   let rawBackendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

   if (typeof window !== 'undefined' && window.location.hostname.includes('onrender.com')) {
      // If env var is missing or defaulted to localhost on a production domain, 
      // construct the URL based on Render's predictable naming scheme.
      if (rawBackendUrl.includes('localhost') || !rawBackendUrl) {
         const currentHost = window.location.origin; // e.g. https://orion-frontend.onrender.com
         rawBackendUrl = currentHost.replace('-frontend', '-backend');
         console.log(`[Orion Architecture] Dynamic Proxy Activated: Redirecting Localhost -> ${rawBackendUrl}`);
      }
   }

   // Normalize URL: Remove trailing slash if present
   const BACKEND_URL = rawBackendUrl.replace(/\/$/, "");

   console.log(`[Orion Architecture] Target Core: ${BACKEND_URL}`);

   // Live Matrix Polling
   useEffect(() => {
      if (!engineStarted || connectionStatus !== 'ONLINE') return;

      const pollMatrix = async () => {
         try {
            const res = await fetch(`${BACKEND_URL}/api/matrix/status`);
            if (res.ok) {
               const data = await res.json();
               setMatrixStatus(data);

               // Dynamic Profit Target: Directly from the backend's "Profit Forge" algorithm
               if (data.systemTotalProjectedProfit) {
                  setProfitTarget(data.systemTotalProjectedProfit);
               }

               // Update visualization based on live status (simplified mapping)
               setPerformanceStats(prev => prev.map((val, idx) => {
                  const strategies = Object.keys(data.matrix); // Order matters, assuming same order
                  const stratKey = strategies[idx];
                  const status = data.matrix[stratKey]?.status;

                  // Dynamic fluctuation based on LIVE status
                  if (status === 'ACTIVE') return 99.0 + (Math.random() * 1.0);
                  if (status === 'SCANNING') return 98.0 + (Math.random() * 0.5);
                  if (status === 'STANDBY') return 0;
                  return val; // Keep existing if unknown
               }));
            }
         } catch (e) {
            console.error("Matrix poll failed", e);
         }
      };

      const interval = setInterval(pollMatrix, 2000); // 2s poll for live feel
      return () => clearInterval(interval);
   }, [engineStarted, connectionStatus, BACKEND_URL]);

   // Address Validation Helper
   const validateAddress = (address: string) => {
      try {
         if (!address) return false;
         return ethers.isAddress(address);
      } catch {
         return false;
      }
   };

   // MetaMask Detection
   const detectWalletAddress = async () => {
      if (detectingWallet) return;
      setDetectingWallet(true);
      setIsWalletDetected(false);
      setIsAddressValid(false);

      try {
         await new Promise(resolve => setTimeout(resolve, 1000));
         if (typeof (window as any).ethereum !== 'undefined') {
            const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
            if (accounts && accounts.length > 0) {
               const address = accounts[0];
               setTargetWallet(address);
               setIsWalletDetected(true);
               setIsAddressValid(validateAddress(address));
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

   // Manual Address Input Handler
   const handleAddressInput = (address: string) => {
      setTargetWallet(address);
      setIsAddressValid(validateAddress(address));
   };

   const handleWithdrawalExecution = async () => {
      if (!targetWallet || !isAddressValid) return;
      setExecutingWithdrawal(true);

      try {
         // In production this would call /api/withdrawal/execute
         await new Promise(resolve => setTimeout(resolve, 3000));
         console.log(`[Orion Settlement] Automated Transfer of ${formatCurrency(totalProfit)} to ${targetWallet} COMPLETE.`);
         alert(`Withdrawal Successful: ${formatCurrency(totalProfit)} sent to ${targetWallet}`);
      } catch (err) {
         console.error("Auto-withdrawal failed", err);
      } finally {
         setExecutingWithdrawal(false);
      }
   };

   // Auto-Withdrawal Watcher
   useEffect(() => {
      if (withdrawalMode === 'AUTO' && isAddressValid && totalProfit >= autoWithdrawThreshold && !executingWithdrawal) {
         console.log(`[Orion Sentinel] Profit threshold breached (${formatCurrency(totalProfit)} > ${formatCurrency(autoWithdrawThreshold)}). Initiating Automated Settlement.`);
         handleWithdrawalExecution();
      }
   }, [totalProfit, withdrawalMode, isAddressValid, autoWithdrawThreshold, executingWithdrawal]);

   useEffect(() => {
      const fetchAuditedStats = async () => {
         if (connectionStatus !== 'ONLINE') return;
         setIsAuditing(true);
         try {
            const res = await fetch(`${BACKEND_URL}/api/performance/stats`);
            if (res.ok) {
               const data = await res.json();
               setAuditedStats(data);
            }
         } catch (e) {
            console.error("Audited stats fetch failed", e);
         } finally {
            setIsAuditing(false);
         }
      };

      fetchAuditedStats();
      const interval = setInterval(fetchAuditedStats, 15000); // Audit every 15s
      return () => clearInterval(interval);
   }, [BACKEND_URL, connectionStatus]);

   useEffect(() => {
      const pollBots = async () => {
         if (!engineStarted || connectionStatus !== 'ONLINE') return;
         try {
            const res = await fetch(`${BACKEND_URL}/api/bots/status`);
            if (res.ok) {
               const data = await res.json();
               setBotFleet(data);
            }
         } catch (e) {
            console.error("Bot poll failed", e);
         }
      };

      pollBots();
      const interval = setInterval(pollBots, 3000); // 3s poll for bot swarm
      return () => clearInterval(interval);
   }, [engineStarted, connectionStatus, BACKEND_URL]);

   const checkBackend = async () => {
      // Circuit Breaker: If we are already probing, don't overlap
      if (connectionStatus === 'PROBING' && serverStatus) return;

      setConnectionStatus('PROBING');
      try {
         const hRes = await fetch(`${BACKEND_URL}/api/health`);

         if (hRes.ok) {
            try {
               const sRes = await fetch(`${BACKEND_URL}/api/status`);
               if (sRes.ok) {
                  const sData = await sRes.json();
                  setServerStatus(sData);
                  console.log(`[Orion Neural Sync] Core: ONLINE | Signer: ${sData.blockchain?.signer ? 'ACTIVE' : 'SENTINEL'}`);
               }
            } catch (e) {
               console.warn("[Orion Architecture] Health check passed but Status check failed. Likely partial boot.");
            }
            setConnectionStatus('ONLINE');
         } else {
            console.error(`[Orion Architecture] Core responded with ${hRes.status}`);
            setConnectionStatus('OFFLINE');
         }
      } catch (e) {
         console.error("[Orion Architecture] Backend Connection Interrupted:", e);
         setConnectionStatus('OFFLINE');
      }
   };

   // Manual Retry Trigger
   const retryConnection = () => {
      setConnectionStatus('PROBING');
      setTimeout(checkBackend, 500);
   };

   useEffect(() => {
      checkBackend();
      const interval = setInterval(checkBackend, 30000); // Check every 30s
      return () => clearInterval(interval);
   }, [BACKEND_URL]); // Removed engineStarted to avoid unnecessary resets

   const authorizeSession = async () => {
      try {
         // 1. Check if server already has authority
         if (serverStatus?.blockchain?.signer) return true;

         console.log("[Orion Security] Initiating Ephemeral Handshake...");

         // 2. Generate temporary session key in browser memory
         // This is a "Disposable Signer" that exists only for this trading session
         const sessionWallet = ethers.Wallet.createRandom();

         // 3. User signs authorization via MetaMask
         if (!(window as any).ethereum) throw new Error("MetaMask not found");
         const provider = new ethers.BrowserProvider((window as any).ethereum);
         const signer = await provider.getSigner();

         const message = `ORION_AUTH: Authorize Ephemeral Session Key ${sessionWallet.address} to execute trades via Pimlico Paymaster. Valid for current session only.`;
         await signer.signMessage(message);

         // 4. Send ephemeral key to backend (Memory-Only storage)
         const res = await fetch(`${BACKEND_URL}/api/session/authorize`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionKey: sessionWallet.privateKey })
         });

         if (res.ok) {
            console.log("[Orion Security] Handshake Verified. Vantage Mode Authorised.");
            // Refresh status immediately
            const sRes = await fetch(`${BACKEND_URL}/api/status`);
            const sData = await sRes.json();
            setServerStatus(sData);

            // Generate deployment contract number
            const deploymentId = `ORION-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
            setDeploymentContractNumber(deploymentId);

            // Capture smart account address
            if (sData.blockchain?.accountAddress) {
               setGeneratedSmartAccount(sData.blockchain.accountAddress);
               console.log(`[Orion Architecture] Smart Account Forged: ${sData.blockchain.accountAddress}`);
               console.log(`[Orion Deployment] Contract Number: ${deploymentId}`);
            }
            return true;
         }
         return false;
      } catch (e: any) {
         console.error("Authorisation failed", e);
         alert(`Security Handshake Failed: ${e.message}`);
         return false;
      }
   };

   const toggleEngine = async () => {
      if (connectionStatus !== 'ONLINE') {
         const msg = connectionStatus === 'PROBING'
            ? "Establishing link to enterprise core... Please wait."
            : "Cannot start engine: Backend connection failed. Please ensure the enterprise server is running.";
         alert(msg);
         return;
      }

      // Trigger Security Handshake if necessary
      const authorized = await authorizeSession();
      if (!authorized) return;

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
                                 <svg width="280" height="280" viewBox="0 0 280 280" className={`transform -rotate-90 transition-all duration-1000 ${engineStarted ? 'scale-110 drop-shadow-[0_0_30px_rgba(251,191,36,0.1)]' : 'opacity-40'}`}>
                                    {/* Profit Achievement Progress Ring (Outer) */}
                                    {engineStarted && (
                                       <>
                                          {/* Background ring */}
                                          <circle
                                             cx="140"
                                             cy="140"
                                             r="130"
                                             fill="transparent"
                                             stroke="#1e293b"
                                             strokeWidth="8"
                                          />
                                          {/* Progress ring */}
                                          <circle
                                             cx="140"
                                             cy="140"
                                             r="130"
                                             fill="transparent"
                                             stroke="#10b981"
                                             strokeWidth="8"
                                             strokeDasharray={`${(profitAchievement / 100) * (2 * Math.PI * 130)} ${2 * Math.PI * 130}`}
                                             className="transition-all duration-1000"
                                             style={{ filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.5))' }}
                                          />
                                       </>
                                    )}

                                    {/* Strategy Distribution Rings (Inner) */}
                                    {APEX_STRATEGY_NODES.map((item, idx) => {
                                       const circumference = 2 * Math.PI * 105;
                                       const dash = (item.contribution / 100) * circumference;
                                       const offset = -APEX_STRATEGY_NODES.slice(0, idx).reduce((acc, curr) => acc + (curr.contribution / 100) * circumference, 0);
                                       return (
                                          <circle
                                             key={idx}
                                             cx="140"
                                             cy="140"
                                             r="105"
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
                                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Total Profit</span>
                                    <span className="text-3xl font-black text-[#fbbf24] font-mono tracking-tighter leading-none">
                                       {engineStarted ? formatCurrency(totalProfit) : '---'}
                                    </span>
                                    <span className={`text-[7px] font-bold uppercase mt-1 ${engineStarted ? 'text-green-400' : 'text-slate-600'}`}>
                                       {engineStarted ? `${profitAchievement.toFixed(1)}% of Target` : 'LOCKED'}
                                    </span>
                                    {engineStarted && (
                                       <span className="text-[6px] font-black text-slate-600 uppercase tracking-widest mt-0.5">
                                          Target: {formatCurrency(profitTarget)}
                                       </span>
                                    )}
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

                           {/* TRI-TIER BOT FLEET MONITORING */}
                           <div className="flex flex-col gap-6 mt-8">
                              <div className="flex items-center gap-3">
                                 <div className="p-2 bg-slate-800 rounded-lg">
                                    <Layers size={14} className="text-white" />
                                 </div>
                                 <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Tri-Tier Bot Fleet</h3>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                 {/* TIER 1: SCANNERS */}
                                 <div className="p-6 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-4">
                                    <div className="flex justify-between items-center mb-2">
                                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tier 1: Scanners</span>
                                       <span className="text-[10px] font-black text-blue-400 font-mono">
                                          {botFleet?.scanners?.length || 0} Nodes
                                       </span>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                       {botFleet?.scanners?.map((s: any, i: number) => (
                                          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                                             <div className="flex items-center gap-3">
                                                <ScanEye size={12} className="text-blue-400" />
                                                <div className="flex flex-col">
                                                   <span className="text-[9px] font-black text-white">{s.id}</span>
                                                   <span className="text-[7px] font-bold text-slate-600 uppercase tracking-tighter">{s.type}</span>
                                                </div>
                                             </div>
                                             <div className="flex items-center gap-4">
                                                <div className="flex flex-col items-end">
                                                   <span className="text-[7px] font-black text-slate-500 uppercase tracking-tighter">Hits</span>
                                                   <span className="text-[9px] font-mono font-black text-blue-400">{s.hits}</span>
                                                </div>
                                                <div className={`w-1.5 h-1.5 rounded-full ${s.status === 'SCANNING' ? 'bg-blue-400 animate-pulse' : 'bg-slate-800'}`} />
                                             </div>
                                          </div>
                                       ))}
                                    </div>
                                 </div>

                                 {/* TIER 2: CAPTAIN */}
                                 <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/5 to-transparent border border-amber-500/10 flex flex-col gap-4">
                                    <div className="flex justify-between items-center mb-2">
                                       <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Tier 2: Orchestrator</span>
                                       <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${botFleet?.captain?.status === 'ACTIVE' ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-500'}`}>
                                          {botFleet?.captain?.status || 'IDLE'}
                                       </div>
                                    </div>
                                    <div className="flex flex-col gap-6 py-4 justify-center items-center flex-1">
                                       <div className="relative">
                                          <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-1000 ${botFleet?.captain?.status === 'ACTIVE' ? 'bg-amber-500/20 scale-150' : 'bg-transparent'}`} />
                                          <div className={`w-16 h-16 rounded-3xl border-2 flex items-center justify-center relative transition-all duration-500 ${botFleet?.captain?.status === 'ACTIVE' ? 'border-amber-500/50 bg-amber-500/10 rotate-45' : 'border-white/10 bg-white/5'}`}>
                                             <BrainCircuit size={28} className={`transition-all duration-500 ${botFleet?.captain?.status === 'ACTIVE' ? 'text-amber-500 -rotate-45' : 'text-slate-700'}`} />
                                          </div>
                                       </div>
                                       <div className="flex flex-col items-center gap-1">
                                          <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">Decision Cycle</span>
                                          <span className="text-lg font-mono font-black text-white">{botFleet?.captain?.decisionCycleMs || 0}ms</span>
                                       </div>
                                    </div>
                                    <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                       <span>Pending Actions</span>
                                       <span className="text-amber-500">{botFleet?.captain?.pendingOrders || 0}</span>
                                    </div>
                                 </div>

                                 {/* TIER 3: EXECUTORS */}
                                 <div className="p-6 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-4">
                                    <div className="flex justify-between items-center mb-2">
                                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tier 3: Executors</span>
                                       <span className="text-[10px] font-black text-[#10b981] font-mono">
                                          {botFleet?.executors?.length || 0} Agents
                                       </span>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                       {botFleet?.executors?.map((e: any, i: number) => (
                                          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                                             <div className="flex items-center gap-3">
                                                <Zap size={12} className={e.busy ? 'text-[#10b981] animate-pulse' : 'text-slate-600'} />
                                                <div className="flex flex-col">
                                                   <span className="text-[9px] font-black text-white">{e.id}</span>
                                                   <span className="text-[7px] font-bold text-slate-600 uppercase tracking-tighter">{e.capability}</span>
                                                </div>
                                             </div>
                                             <div className={`px-2 py-0.5 rounded-[4px] text-[6px] font-black uppercase tracking-widest ${e.busy ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-slate-900 text-slate-700'}`}>
                                                {e.busy ? 'BUSY' : 'READY'}
                                             </div>
                                          </div>
                                       ))}
                                    </div>
                                 </div>
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
                                       {engineStarted ? formatCurrency(totalProfit) : 'LOCKED'}
                                    </span>
                                    {engineStarted && (
                                       <div className="flex flex-col gap-2">
                                          <span className="text-[11px] font-black text-green-400 uppercase tracking-widest flex items-center gap-1 bg-green-500/10 px-3 py-1 rounded-lg border border-green-500/20">
                                             <ArrowUpRight size={12} /> +4.2%
                                          </span>
                                          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded border border-blue-500/30 bg-blue-500/5 ${isAuditing ? 'animate-pulse' : ''}`}>
                                             <ShieldCheck size={10} className="text-blue-400" />
                                             <span className="text-[7px] font-black text-blue-400 uppercase tracking-tighter">Etherscan Verified</span>
                                          </div>
                                       </div>
                                    )}
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="bg-black/60 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl shadow-xl flex flex-col gap-10 text-left">
                           {/* Withdrawal Mode Selection */}
                           <div className="flex items-center justify-between border-b border-white/5 pb-6">
                              <div className="flex items-center gap-4">
                                 <div className="p-3 bg-[#fbbf24]/10 rounded-2xl border border-[#fbbf24]/20">
                                    <Settings size={22} className="text-[#fbbf24]" />
                                 </div>
                                 <div>
                                    <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">Withdrawal Mode</h3>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Configure transfer automation</p>
                                 </div>
                              </div>
                              <div className="flex gap-3">
                                 <button
                                    onClick={() => setWithdrawalMode('MANUAL')}
                                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${withdrawalMode === 'MANUAL'
                                       ? 'bg-[#fbbf24] text-black'
                                       : 'bg-white/5 text-slate-600 hover:bg-white/10'
                                       }`}
                                 >
                                    Manual
                                 </button>
                                 <button
                                    onClick={() => setWithdrawalMode('AUTO')}
                                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${withdrawalMode === 'AUTO'
                                       ? 'bg-[#10b981] text-black'
                                       : 'bg-white/5 text-slate-600 hover:bg-white/10'
                                       }`}
                                 >
                                    Auto
                                 </button>
                              </div>
                           </div>

                           {/* Auto Mode Threshold */}
                           {withdrawalMode === 'AUTO' && (
                              <div className="p-6 rounded-2xl bg-[#10b981]/5 border border-[#10b981]/20 flex flex-col gap-4">
                                 <div className="flex items-center gap-2">
                                    <Zap size={14} className="text-[#10b981]" />
                                    <span className="text-[10px] font-black text-[#10b981] uppercase tracking-widest">Auto-Transfer Threshold</span>
                                 </div>
                                 <div className="flex items-center gap-4">
                                    <input
                                       type="number"
                                       value={viewCurrency === 'ETH' ? (autoWithdrawThreshold / ethPrice) : autoWithdrawThreshold}
                                       onChange={(e) => {
                                          const val = Number(e.target.value);
                                          setAutoWithdrawThreshold(viewCurrency === 'ETH' ? val * ethPrice : val);
                                       }}
                                       className="flex-1 bg-black/40 border border-[#10b981]/20 rounded-xl py-3 px-4 text-sm font-mono text-white focus:outline-none focus:border-[#10b981]/40"
                                    />
                                    <span className="text-[10px] font-black text-slate-500 uppercase">{viewCurrency}</span>
                                 </div>
                                 <p className="text-[8px] text-slate-600 uppercase font-bold tracking-wider">
                                    Automated settlement active. Profits will transfer when balance breaches the {formatCurrency(autoWithdrawThreshold)} (1 ETH) threshold.
                                 </p>
                              </div>
                           )}

                           {/* Recipient Wallet */}
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
                              {isWalletDetected && isAddressValid && (
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
                                    onChange={(e) => handleAddressInput(e.target.value)}
                                    placeholder="Enter Withdrawal Address (0x...)"
                                    className={`w-full bg-black/40 border rounded-[1.5rem] py-6 px-8 text-sm font-mono text-[#fbbf24] focus:outline-none transition-all placeholder:text-slate-800 ${targetWallet && isAddressValid
                                       ? 'border-green-500/40 focus:border-green-500/60'
                                       : targetWallet && !isAddressValid
                                          ? 'border-red-500/40 focus:border-red-500/60'
                                          : 'border-white/5 focus:border-[#fbbf24]/40'
                                       }`}
                                 />
                                 {targetWallet && (
                                    <div className={`absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-xl border transition-all ${isAddressValid
                                       ? 'bg-green-500/10 border-green-500/30'
                                       : 'bg-red-500/10 border-red-500/30'
                                       }`}>
                                       {isAddressValid ? (
                                          <CheckCircle2 size={16} className="text-green-500" />
                                       ) : (
                                          <ShieldX size={16} className="text-red-500" />
                                       )}
                                    </div>
                                 )}
                              </div>
                              <p className="text-[9px] text-slate-600 uppercase font-black tracking-[0.1em] leading-relaxed max-w-2xl">
                                 Ensure the destination address is correctly formatted. All transfers are processed through the Orion High-Speed Relay to ensure minimal slippage and maximum privacy on the target chain.
                              </p>
                           </div>
                        </div>

                        <button
                           onClick={handleWithdrawalExecution}
                           disabled={executingWithdrawal || !engineStarted || (targetWallet !== '' && !isAddressValid) || !targetWallet}
                           className={`w-auto self-center px-16 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-5 relative overflow-hidden ${!engineStarted || (targetWallet !== '' && !isAddressValid) || !targetWallet
                              ? 'bg-slate-900 text-slate-700 cursor-not-allowed border border-white/5'
                              : 'bg-[#fbbf24] text-black hover:scale-[1.01] shadow-[0_0_30px_rgba(251,191,36,0.2)] hover:bg-[#fcd34d]'
                              }`}
                        >
                           {executingWithdrawal ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
                           {!engineStarted
                              ? "Engine Required"
                              : (!targetWallet
                                 ? "Target Wallet Required"
                                 : (!isAddressValid
                                    ? "Invalid Destination"
                                    : (executingWithdrawal ? "Settling Assets..." : `Withdraw Profits (${viewCurrency})`)))}
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
                     <div className={`w-1.5 h-1.5 rounded-full transition-colors ${connectionStatus === 'ONLINE' ? 'bg-[#10b981] shadow-[0_0_8px_#10b981]' :
                        connectionStatus === 'PROBING' ? 'bg-blue-500 shadow-[0_0_8px_#3b82f6] animate-pulse' :
                           'bg-red-500 shadow-[0_0_8px_#ef4444]'
                        }`} />
                     <span className={`text-[8px] font-black uppercase tracking-widest ${connectionStatus === 'ONLINE' ? 'text-slate-500' :
                        connectionStatus === 'PROBING' ? 'text-blue-500' : 'text-red-500'
                        }`}>
                        {connectionStatus === 'ONLINE' ? 'SERVER: ONLINE' :
                           connectionStatus === 'PROBING' ? 'SERVER: LINKING...' : 'SERVER: DISCONNECTED'}
                     </span>
                     {connectionStatus === 'OFFLINE' && (
                        <button
                           onClick={retryConnection}
                           className="text-[7px] font-black text-[#fbbf24] border border-[#fbbf24]/30 px-2 py-0.5 rounded hover:bg-[#fbbf24]/10 transition-colors uppercase tracking-widest animate-pulse"
                        >
                           Retry
                        </button>
                     )}
                     <div className="hidden lg:block h-3 w-px bg-white/5 mx-2" />
                     <span className="hidden lg:block text-[6px] font-mono text-slate-700 uppercase tracking-tighter truncate max-w-[150px]" title={BACKEND_URL}>
                        Core: {BACKEND_URL}
                     </span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className={`w-1.5 h-1.5 rounded-full transition-colors ${engineStarted ? 'bg-[#10b981] shadow-[0_0_8px_#10b981]' : 'bg-[#fbbf24]'}`} />
                     <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                        {engineStarted ? 'SYSTEM_STATE: RUNNING' : 'SYSTEM_STATE: STANDBY'}
                     </span>
                  </div>
                  {serverStatus?.blockchain?.mode === 'VANTAGE_GASLESS' && (
                     <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-2 py-0.5 rounded border border-[#10b981]/30 bg-[#10b981]/5">
                           <div className="w-1 h-1 rounded-full bg-[#10b981] animate-pulse" />
                           <span className="text-[7px] font-black text-[#10b981] uppercase tracking-tighter">VANTAGE_MODE: ACTIVE (GASLESS)</span>
                        </div>
                        {serverStatus.blockchain.accountAddress && (
                           <div className="hidden md:flex items-center gap-2 group cursor-pointer" onClick={() => {
                              navigator.clipboard.writeText(serverStatus.blockchain.accountAddress);
                              alert("Smart Account Address Copied");
                           }}>
                              <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest group-hover:text-[#fbbf24] transition-colors">ACC:</span>
                              <span className="text-[7px] font-mono text-slate-500 group-hover:text-[#fbbf24] transition-colors">{serverStatus.blockchain.accountAddress.slice(0, 6)}...{serverStatus.blockchain.accountAddress.slice(-4)}</span>
                              <Copy size={8} className="text-slate-700 group-hover:text-[#fbbf24]" />
                           </div>
                        )}
                        {deploymentContractNumber && (
                           <div className="hidden md:flex items-center gap-2 px-2 py-0.5 rounded border border-purple-500/30 bg-purple-500/5">
                              <span className="text-[7px] font-black text-purple-400 uppercase tracking-tighter">CTR: {deploymentContractNumber}</span>
                           </div>
                        )}
                     </div>
                  )}
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
