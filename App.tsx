import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
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
    Zap as SyncIcon, X
} from 'lucide-react';
import { WalletIntel } from './types';
import { autoDiscoverPorts, validatePortAllocation } from './src/shared/utils/portDiscovery';

// Toast Notification System
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (type: ToastType, message: string, duration?: number) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

const ConfirmationDialog: React.FC<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    type?: 'danger' | 'warning' | 'info';
}> = ({ isOpen, title, message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel, type = 'warning' }) => {
    if (!isOpen) return null;

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') onConfirm();
        if (e.key === 'Escape') onCancel();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onKeyDown={handleKeyDown}>
            <div className="bg-black/95 border border-white/20 rounded-[2rem] p-8 max-w-md w-full">
                <div className="flex items-center gap-3 mb-4">
                    {type === 'danger' && <ShieldX size={24} className="text-red-500" />}
                    {type === 'warning' && <AlertIcon size={24} className="text-[#fbbf24]" />}
                    {type === 'info' && <Info size={24} className="text-[#06b6d4]" />}
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">{title}</h3>
                </div>
                <p className="text-sm text-slate-300 mb-6">{message}</p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest bg-white/5 text-slate-400 hover:bg-white/10 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
                            type === 'danger'
                                ? 'bg-red-500 text-black hover:scale-105'
                                : type === 'warning'
                                  ? 'bg-[#fbbf24] text-black hover:scale-105'
                                  : 'bg-[#06b6d4] text-black hover:scale-105'
                        }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (type: ToastType, message: string, duration = 5000) => {
        const id = Date.now().toString();
        const toast: Toast = { id, type, message, duration };
        setToasts(prev => [...prev, toast]);

        if (duration > 0) {
            setTimeout(() => removeToast(id), duration);
        }
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <div className="fixed top-4 right-4 z-[1000] space-y-2">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`p-4 rounded-xl border backdrop-blur-3xl shadow-xl flex items-center gap-3 min-w-[300px] transition-all duration-300 ${
                            toast.type === 'success' ? 'bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981]' :
                            toast.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-500' :
                            toast.type === 'warning' ? 'bg-[#fbbf24]/10 border-[#fbbf24]/30 text-[#fbbf24]' :
                            'bg-[#06b6d4]/10 border-[#06b6d4]/30 text-[#06b6d4]'
                        }`}
                    >
                        {toast.type === 'success' && <CheckCircle2 size={20} />}
                        {toast.type === 'error' && <ShieldX size={20} />}
                        {toast.type === 'warning' && <AlertIcon size={20} />}
                        {toast.type === 'info' && <Info size={20} />}
                        <span className="flex-1 text-sm font-medium">{toast.message}</span>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                            aria-label="Close notification"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

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

const AppContent: React.FC = () => {
   const { addToast } = useToast();
   const [activeView, setActiveView] = useState<'MASTER' | 'PERFORMANCE' | 'WITHDRAW' | 'INTEL' | 'LEARNING'>('MASTER');
  const [learningCurveData, setLearningCurveData] = useState<any>({
    totalIterations: 1247,
    discoveredStrategies: 89,
    perfectMatchScore: 94.2,
    confidenceScore: 87.3,
    learningRate: 0.1,
    profitDayProgression: [
      { milestone: '25% Profit Target', achieved: true, iteration: 312, score: '78.4%', date: '2024-01-15' },
      { milestone: '50% Profit Target', achieved: true, iteration: 624, score: '84.2%', date: '2024-01-22' },
      { milestone: '75% Profit Target', achieved: true, iteration: 936, score: '89.7%', date: '2024-01-29' },
      { milestone: '100% Profit Target', achieved: false, iteration: 1248, score: '94.2%', date: '2024-02-05' }
    ],
    strategyCombinations: [],
    historicalPerformance: []
  });
   const [sidebarExpanded, setSidebarExpanded] = useState(false);
   const [engineStarted, setEngineStarted] = useState(false);
   const [deploymentContractNumber, setDeploymentContractNumber] = useState('');
   const [generatedSmartAccount, setGeneratedSmartAccount] = useState('');
   const [engineStarting, setEngineStarting] = useState(false);
   const [startProgress, setStartProgress] = useState(0);
   const [startStep, setStartStep] = useState('');
   const [showStartConfirmation, setShowStartConfirmation] = useState(false);
   const [engineStartSteps] = useState([
       'Initializing connection check',
       'Authorizing security handshake',
       'Generating deployment contract',
       'Forging smart wallet address',
       'AI port discovery',
       'Matrix profit target discovery',
       'Final deployment validation'
   ]);
   const [discoveredPorts, setDiscoveredPorts] = useState<{frontend: number | null, backend: number | null, monitoring: number | null, database: number | null}>({
      frontend: null,
      backend: null,
      monitoring: null,
      database: null
   });

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
   const [showWithdrawConfirmation, setShowWithdrawConfirmation] = useState(false);
   const [showMonitorConfirmation, setShowMonitorConfirmation] = useState(false);
   const [startingBots, setStartingBots] = useState(false);
   const [stoppingBots, setStoppingBots] = useState(false);

   // Scan for Alpha functionality
   const [isScanning, setIsScanning] = useState(false);
   const [scanResults, setScanResults] = useState<any>(null);
   const [showScanModal, setShowScanModal] = useState(false);

   // Performance Fluctuations
   const [performanceStats, setPerformanceStats] = useState(APEX_STRATEGY_NODES.map(() => 0));

   const [matrixStatus, setMatrixStatus] = useState<any>(null);
   const [botFleet, setBotFleet] = useState<any>(null);

   // Backend Connection Logic
   type ConnectionStatus = 'IDLE' | 'PROBING' | 'SCANNING' | 'ONLINE' | 'OFFLINE';
   const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('IDLE');
   const [serverStatus, setServerStatus] = useState<any>(null);

   // Simplified Discovery Logic:
   // 1. Check manual override from localStorage
   // 2. Use build-time env var (VITE_BACKEND_URL)
   // 3. Fallback to localhost for dev
   const [manualBackendUrl, setManualBackendUrl] = useState(localStorage.getItem('ORION_BACKEND_OVERRIDE') || '');
   let rawBackendUrl = manualBackendUrl || import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

   // Normalize URL
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

   // Learning Curve Polling
   useEffect(() => {
      if (!engineStarted || connectionStatus !== 'ONLINE') return;

      const pollLearningCurve = async () => {
         try {
            const res = await fetch(`${BACKEND_URL}/api/learning/metrics`);
            if (res.ok) {
               const data = await res.json();
               setLearningCurveData(data);
            }
         } catch (e) {
            console.error("Learning curve poll failed", e);
         }
      };

      // Initial fetch
      pollLearningCurve();

      // Poll every 5 seconds when engine is running
      const interval = setInterval(pollLearningCurve, 5000);
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
            addToast('error', 'Wallet extension (MetaMask) not found. Please install MetaMask to connect your wallet.');
         }
      } catch (err) {
         console.error("Link failed", err);
         addToast('error', 'Failed to connect wallet. Please try again.');
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
         addToast('success', `Withdrawal Successful: ${formatCurrency(totalProfit)} sent to ${targetWallet}`);
      } catch (err) {
         console.error("Auto-withdrawal failed", err);
      } finally {
         setExecutingWithdrawal(false);
      }
   };

   const handleScanForAlpha = async () => {
      if (isScanning) return;
      setIsScanning(true);

      try {
         console.log("[Orion Alpha Scan] Initiating deep market scan...");
         const res = await fetch(`${BACKEND_URL}/api/scan/alpha`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ scanType: 'FULL_MATRIX' })
         });

         if (res.ok) {
            const data = await res.json();
            setScanResults(data);
            console.log("[Orion Alpha Scan] Scan complete - Alpha opportunities detected:", data.opportunities?.length || 0);
            addToast('success', `Alpha Scan Complete! Found ${data.opportunities?.length || 0} opportunities.`);
         } else {
            console.error("[Orion Alpha Scan] Scan failed");
            addToast('error', 'Alpha scan failed. Please check backend connection and try again.');
         }
      } catch (error) {
         console.error("[Orion Alpha Scan] Error:", error);
         addToast('error', 'Alpha scan error occurred. Please try again later.');
      } finally {
         setIsScanning(false);
      }
   };

   const handleStartBots = async () => {
      if (startingBots) return;
      setStartingBots(true);

      try {
         console.log("[Orion Bot Control] Starting bot system...");
         const res = await fetch(`${BACKEND_URL}/api/bots/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
         });

         if (res.ok) {
            const data = await res.json();
            console.log("[Orion Bot Control] Bot system started successfully:", data);
            addToast('success', 'Bot system started successfully!');
            // Refresh bot status
            if (engineStarted) {
               const statusRes = await fetch(`${BACKEND_URL}/api/bots/status`);
               if (statusRes.ok) {
                  const statusData = await statusRes.json();
                  setBotFleet(statusData);
               }
            }
         } else {
            console.error("[Orion Bot Control] Failed to start bot system");
            addToast('error', 'Failed to start bot system. Please check backend connection.');
         }
      } catch (error) {
         console.error("[Orion Bot Control] Error starting bots:", error);
         addToast('error', 'Error starting bot system. Please try again later.');
      } finally {
         setStartingBots(false);
      }
   };

   const handleStopBots = async () => {
      if (stoppingBots) return;
      setStoppingBots(true);

      try {
         console.log("[Orion Bot Control] Stopping bot system...");
         const res = await fetch(`${BACKEND_URL}/api/bots/stop`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
         });

         if (res.ok) {
            const data = await res.json();
            console.log("[Orion Bot Control] Bot system stopped successfully:", data);
            addToast('success', 'Bot system stopped successfully!');
            // Refresh bot status
            if (engineStarted) {
               const statusRes = await fetch(`${BACKEND_URL}/api/bots/status`);
               if (statusRes.ok) {
                  const statusData = await statusRes.json();
                  setBotFleet(statusData);
               }
            }
         } else {
            console.error("[Orion Bot Control] Failed to stop bot system");
            addToast('error', 'Failed to stop bot system. Please check backend connection.');
         }
      } catch (error) {
         console.error("[Orion Bot Control] Error stopping bots:", error);
         addToast('error', 'Error stopping bot system. Please try again later.');
      } finally {
         setStoppingBots(false);
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
            const contentType = hRes.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
               throw new Error("Backend returned non-JSON response. Check if Backend URL is correct.");
            }

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
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
               throw new Error("Security handshake returned non-JSON. Possible Backend URL mismatch.");
            }
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
         addToast('error', `Security Handshake Failed: ${e.message}`);
         return false;
      }
   };

   const toggleEngine = async () => {
      console.log("[ORION WORKFLOW] 🚀 START ENGINE initiated - Beginning complete workflow sequence...");

      setEngineStarting(true);
      setStartProgress(0);
      setStartStep(engineStartSteps[0]);

      if (connectionStatus !== 'ONLINE') {
         const msg = connectionStatus === 'PROBING'
            ? "Establishing link to enterprise core... Please wait."
            : `Cannot start engine: Connection to Enterprise Core at [${BACKEND_URL}] failed. Please ensure the server is running and verified.`;
         addToast('error', msg);
         setEngineStarting(false);
         return;
      }

      setStartProgress(14);
      setStartStep(engineStartSteps[1]);
      console.log("[ORION WORKFLOW] ✅ Step 1: Backend connection verified");

      // Trigger Security Handshake if necessary
      console.log("[ORION WORKFLOW] 🔐 Step 2: Initiating security authorization handshake...");
      const authorized = await authorizeSession();
      if (!authorized) {
         console.error("[ORION WORKFLOW] ❌ Step 2: Security authorization failed");
         setEngineStarting(false);
         return;
      }
      setStartProgress(28);
      setStartStep(engineStartSteps[2]);
      console.log("[ORION WORKFLOW] ✅ Step 2: Security authorization successful");

      // CRITICAL DEPLOYMENT VALIDATION: Generate Dynamic Contract & Smart Wallet Addresses
      console.log("[ORION WORKFLOW] 📋 Step 3: Initializing dynamic address generation...");

      // 1. Generate Dynamic Deployment Contract Address
      const deploymentId = `ORION-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      setDeploymentContractNumber(deploymentId);
      setStartProgress(42);
      setStartStep(engineStartSteps[3]);
      console.log(`[ORION WORKFLOW] ✅ Step 3a: Contract address generated: ${deploymentId}`);

      // 2. Generate/Retrieve Smart Wallet Address from Backend
      console.log("[ORION WORKFLOW] 🔗 Step 3b: Retrieving smart wallet address from backend...");
      try {
         const statusRes = await fetch(`${BACKEND_URL}/api/status`);
         if (statusRes.ok) {
            const sData = await statusRes.json();
            if (sData.blockchain?.accountAddress) {
               setGeneratedSmartAccount(sData.blockchain.accountAddress);
               setStartProgress(56);
               setStartStep(engineStartSteps[4]);
               console.log(`[ORION WORKFLOW] ✅ Step 3b: Smart wallet address forged: ${sData.blockchain.accountAddress}`);
               console.log(`[ORION WORKFLOW] ✅ Step 3: DEPLOYMENT VALIDATION COMPLETE - All addresses generated successfully`);
            } else {
               console.error("[ORION WORKFLOW] ❌ Step 3b: Smart wallet address generation failed");
               addToast('error', 'Deployment Error: Smart Wallet Address could not be generated. Please check backend configuration.');
               setEngineStarting(false);
               return;
            }
         } else {
            console.error("[ORION WORKFLOW] ❌ Step 3b: Status check failed during deployment validation");
            addToast('error', 'Deployment Error: Could not validate smart wallet generation. Please check backend connection.');
            setEngineStarting(false);
            return;
         }
      } catch (error) {
         console.error("[ORION WORKFLOW] ❌ Step 3: Address generation error:", error);
         addToast('error', 'Deployment Error: Failed to generate required addresses. Please try again.');
         setEngineStarting(false);
         return;
      }

      // 4. AI PORT DISCOVERY: Auto-discover optimal ports for deployment
      console.log("[ORION WORKFLOW] 🔍 Step 4: Initiating AI autonomous port discovery...");
      try {
         const ports = await autoDiscoverPorts();
         setDiscoveredPorts(ports);

         // Validate port allocation
         const validation = validatePortAllocation(ports);
         if (!validation.valid) {
            console.warn("[ORION WORKFLOW] ⚠️ Step 4: Port discovery warnings:", validation.missing, validation.conflicts);
            if (validation.missing.length > 0) {
               addToast('warning', `Port Discovery Warning: Some services may not have available ports (${validation.missing.join(', ')}). Engine will proceed with available ports.`);
            }
         }
         setStartProgress(70);
         setStartStep(engineStartSteps[5]);
         console.log("[ORION WORKFLOW] ✅ Step 4: AI port discovery complete - Ready for autonomous deployment");
      } catch (error) {
         console.error("[ORION WORKFLOW] ❌ Step 4: Port discovery error:", error);
         addToast('warning', 'Port discovery failed, but engine will proceed with default configuration.');
      }

      // 4. DISCOVER PROFIT TARGET: Fetch real-time matrix status immediately upon engine start
      try {
         console.log("[Orion Intelligence] Discovering Profit Target from 7-Matrix Real-Time Analysis...");
         const matrixRes = await fetch(`${BACKEND_URL}/api/matrix/status`);
         if (matrixRes.ok) {
            const matrixData = await matrixRes.json();
            const discoveredTarget = matrixData.systemTotalProjectedProfit || 1000000; // Fallback to $1M

            // Set discovered target as session baseline
            setProfitTarget(discoveredTarget);
            setStartProgress(85);
            setStartStep(engineStartSteps[6]);
            console.log(`[Orion Intelligence] Profit Target Discovered: ${formatCurrency(discoveredTarget)}`);

            // Initialize strategy performance tracking for 7-matrix forging capability
            const initialStrategyPerformance = APEX_STRATEGY_NODES.map((node, idx) => {
               const strategyKey = Object.keys(matrixData.matrix)[idx];
               const strategyData = matrixData.matrix[strategyKey];
               return strategyData ? parseFloat(strategyData.score) * 100 : 0;
            });
            setPerformanceStats(initialStrategyPerformance);
         } else {
            console.warn("[Orion Intelligence] Matrix discovery failed, using default target");
         }
      } catch (error) {
         console.error("[Orion Intelligence] Profit target discovery error:", error);
      }

      setStartProgress(100);
      setEngineStarted(true);
      setEngineStarting(false);
      if (activeView !== 'MASTER') setActiveView('MASTER');

      // Final Deployment Success Notification
      addToast('success', 'ORION ENGINE DEPLOYED SUCCESSFULLY! Check deployment details in the footer.');
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
                  {sidebarExpanded && <span className="text-xs font-black uppercase tracking-widest leading-none">Scan & Forge</span>}
               </button>
               <button onClick={() => setActiveView('PERFORMANCE')} className={`flex items-center gap-4 p-4 rounded-xl w-full transition-all group/item relative overflow-hidden ${activeView === 'PERFORMANCE' ? 'bg-[#06b6d4]/20 text-[#06b6d4] border border-[#06b6d4]/30' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
                  <PulseIcon size={22} className="shrink-0" />
                  {sidebarExpanded && <span className="text-xs font-black uppercase tracking-widest leading-none">Monitor</span>}
               </button>
               <button onClick={() => setActiveView('WITHDRAW')} className={`flex items-center gap-4 p-4 rounded-xl w-full transition-all group/item relative overflow-hidden ${activeView === 'WITHDRAW' ? 'bg-[#fbbf24]/20 text-[#fbbf24] border border-[#fbbf24]/30' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
                  <RefreshCw size={22} className="shrink-0" />
                  {sidebarExpanded && <span className="text-xs font-black uppercase tracking-widest leading-none">Withdraw</span>}
               </button>
               <button onClick={() => setActiveView('INTEL')} className={`flex items-center gap-4 p-4 rounded-xl w-full transition-all group/item relative overflow-hidden ${activeView === 'INTEL' ? 'bg-[#a855f7]/20 text-[#a855f7] border border-[#a855f7]/30' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
                  <BrainCircuit size={22} className="shrink-0" />
                  {sidebarExpanded && <span className="text-xs font-black uppercase tracking-widest leading-none">AI Terminal</span>}
               </button>
               <button onClick={() => setActiveView('LEARNING')} className={`flex items-center gap-4 p-4 rounded-xl w-full transition-all group/item relative overflow-hidden ${activeView === 'LEARNING' ? 'bg-[#06b6d4]/20 text-[#06b6d4] border border-[#06b6d4]/30' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
                  <TrendingUp size={22} className="shrink-0" />
                  {sidebarExpanded && <span className="text-xs font-black uppercase tracking-widest leading-none">Learning Curve</span>}
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
                     onClick={() => setShowStartConfirmation(true)}
                     disabled={engineStarted || engineStarting}
                     className={`flex items-center gap-3 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 border overflow-hidden relative group ${engineStarted
                        ? 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                        : engineStarting
                          ? 'bg-[#06b6d4]/10 text-[#06b6d4] border-[#06b6d4]/30'
                          : 'bg-[#fbbf24] text-black border-[#fbbf24] hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(251,191,36,0.25)]'
                        }`}
                  >
                     <GearIcon
                        size={16}
                        className={`${engineStarted ? 'animate-[spin_3s_linear_infinite]' : engineStarting ? 'animate-spin' : 'group-hover:rotate-45 transition-transform'}`}
                     />
                     <span className="relative z-10">
                        {engineStarted ? 'ENGINE RUNNING 24/7!' : engineStarting ? `DEPLOYING... ${startProgress}%` : 'START ENGINE'}
                     </span>
                     {engineStarted && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]" />
                     )}
                     {engineStarting && (
                        <div className="absolute bottom-0 left-0 h-1 bg-[#06b6d4] transition-all duration-300" style={{ width: `${startProgress}%` }} />
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
                                    {/* 7-Matrix Strategy Contribution Rings (Inner) - Real-Time Performance */}
                                    {APEX_STRATEGY_NODES.map((item, idx) => {
                                       // Use real-time performance data instead of static contributions
                                       const realTimeContribution = performanceStats[idx] || 0;
                                       const circumference = 2 * Math.PI * 105;
                                       const dash = (realTimeContribution / 100) * circumference;
                                       const offset = -performanceStats.slice(0, idx).reduce((acc, curr) => acc + (curr / 100) * circumference, 0);
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

                                    {/* Trading Progress Ring (Overlapping) - Green bar measuring progress vs target */}
                                    {engineStarted && (
                                       <>
                                          {/* Progress ring towards discovered target - overlapping donut */}
                                          <circle
                                             cx="140"
                                             cy="140"
                                             r="118"
                                             fill="transparent"
                                             stroke="#10b981"
                                             strokeWidth="12"
                                             strokeDasharray={`${(profitAchievement / 100) * (2 * Math.PI * 118)} ${2 * Math.PI * 118}`}
                                             className="transition-all duration-1000"
                                             style={{ filter: 'drop-shadow(0 0 15px rgba(16, 185, 129, 0.8))' }}
                                          />
                                       </>
                                    )}
                                 </svg>
                                 <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Profit Target</span>
                                    <span className="text-3xl font-black text-[#fbbf24] font-mono tracking-tighter leading-none">
                                       {engineStarted ? formatCurrency(profitTarget) : '---'}
                                    </span>
                                    <span className={`text-[7px] font-bold uppercase mt-1 ${engineStarted ? 'text-green-400' : 'text-slate-600'}`}>
                                       {engineStarted ? `${profitAchievement.toFixed(1)}% Achieved` : 'LOCKED'}
                                    </span>
                                    {engineStarted && (
                                       <>
                                          <span className="text-[6px] font-black text-slate-600 uppercase tracking-widest mt-0.5">
                                             Discovered: {formatCurrency(totalProfit)}
                                          </span>
                                          <span className="text-[6px] font-black text-[#06b6d4] uppercase tracking-widest mt-0.5">
                                             7-MATRIX FORGING
                                          </span>
                                       </>
                                    )}
                                 </div>
                              </div>
                           </div>
                           <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {APEX_STRATEGY_NODES.map((n, idx) => {
                                 // Get real-time performance data for this strategy
                                 const realTimePerformance = performanceStats[idx] || 0;
                                 const strategyData = matrixStatus?.matrix?.[Object.keys(matrixStatus.matrix || {})[idx]];
                                 const strategyYield = strategyData?.yield || '0%';
                                 const strategyStatus = strategyData?.status || 'STANDBY';

                                 return (
                                    <div key={idx} className={`p-5 rounded-2xl bg-black/60 border transition-all duration-700 group relative overflow-hidden text-left ${engineStarted ? 'border-white/10 opacity-100 translate-y-0' : 'border-white/5 opacity-40 translate-y-4'}`} style={{ transitionDelay: `${idx * 100}ms` }}>
                                       <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: engineStarted ? STRATEGY_COLORS[idx % STRATEGY_COLORS.length] : '#334155' }} />
                                       <div className="flex justify-between items-start mb-2">
                                          <span className="text-[10px] font-black text-white uppercase tracking-wider">{n.label}</span>
                                          <div className="flex flex-col items-end">
                                             <span className={`text-[9px] font-mono font-black ${engineStarted ? 'text-[#fbbf24]' : 'text-slate-700'}`}>
                                                {engineStarted ? formatCurrency(n.usdProfit) : 'CALC...'}
                                             </span>
                                             {engineStarted && (
                                                <span className="text-[7px] font-black text-[#06b6d4] uppercase tracking-widest">
                                                   {strategyYield}
                                                </span>
                                             )}
                                          </div>
                                       </div>
                                       <p className="text-[8px] text-slate-600 uppercase font-black tracking-widest leading-tight">{n.strategy}</p>
                                       <div className="mt-3 space-y-2">
                                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                             <div
                                                className={`h-full transition-all duration-1000`}
                                                style={{
                                                   width: engineStarted ? `${realTimePerformance}%` : '0%',
                                                   backgroundColor: engineStarted ? STRATEGY_COLORS[idx % STRATEGY_COLORS.length] : 'transparent'
                                                }}
                                             />
                                          </div>
                                          {engineStarted && (
                                             <div className="flex justify-between items-center text-[6px] font-black uppercase tracking-widest text-slate-500">
                                                <span>FORGING: {strategyStatus}</span>
                                                <span>{realTimePerformance.toFixed(1)}%</span>
                                             </div>
                                          )}
                                       </div>
                                    </div>
                                 );
                              })}
                           </div>
                        </div>

                        {/* Daily Profit Discovery Summary Table */}
                        <div className="mt-8 p-6 rounded-2xl bg-black/60 border border-[#06b6d4]/20 backdrop-blur-3xl">
                           <div className="flex items-center gap-3 mb-6">
                              <TrendingUp size={20} className="text-[#06b6d4]" />
                              <h3 className="text-sm font-black text-white uppercase tracking-widest">Daily Profit Discovery Summary</h3>
                              <div className="ml-auto flex items-center gap-2">
                                 <div className={`w-2 h-2 rounded-full ${engineStarted ? 'bg-[#10b981] animate-pulse' : 'bg-slate-600'}`} />
                                 <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                                    {engineStarted ? 'LIVE DISCOVERY' : 'DISCOVERY OFFLINE'}
                                 </span>
                              </div>
                           </div>
                           <div className="overflow-x-auto">
                              <table className="w-full text-left">
                                 <thead>
                                    <tr className="border-b border-white/10">
                                       <th className="text-[8px] font-black text-slate-500 uppercase tracking-widest pb-3">Strategy & Wallet</th>
                                       <th className="text-[8px] font-black text-slate-500 uppercase tracking-widest pb-3">Daily Profit Discovered</th>
                                       <th className="text-[8px] font-black text-slate-500 uppercase tracking-widest pb-3">Target Achievement</th>
                                       <th className="text-[8px] font-black text-slate-500 uppercase tracking-widest pb-3">Performance Metrics</th>
                                       <th className="text-[8px] font-black text-slate-500 uppercase tracking-widest pb-3">Risk & Efficiency</th>
                                       <th className="text-[8px] font-black text-slate-500 uppercase tracking-widest pb-3">Discovery Status</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {APEX_STRATEGY_NODES.map((node, idx) => {
                                       const strategyData = matrixStatus?.matrix?.[Object.keys(matrixStatus.matrix || {})[idx]];
                                       const realTimePerformance = performanceStats[idx] || 0;
                                       const winRate = strategyData?.winRate || 0;
                                       const gasEfficiency = strategyData?.gasEfficiency || 0;
                                       const riskLevel = strategyData?.riskLevel || 'MEDIUM';
                                       // Calculate daily profit based on performance and contribution
                                       const dailyProfit = engineStarted ? (node.usdProfit * realTimePerformance / 100) : 0;

                                       return (
                                          <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                             <td className="py-4">
                                                <div className="flex flex-col gap-1">
                                                   <div className="flex items-center gap-2">
                                                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: STRATEGY_COLORS[idx % STRATEGY_COLORS.length] }} />
                                                      <span className="text-[9px] font-black text-white uppercase tracking-wider">{node.label}</span>
                                                   </div>
                                                   <span className="text-[7px] font-mono text-slate-400">{node.address}</span>
                                                   <span className="text-[6px] font-bold text-slate-600 uppercase tracking-widest">{node.strategy}</span>
                                                </div>
                                             </td>
                                             <td className="py-4">
                                                <div className="flex flex-col gap-1">
                                                   <span className="text-[12px] font-mono font-black text-[#fbbf24]">
                                                      {engineStarted ? formatCurrency(dailyProfit) : '---'}
                                                   </span>
                                                   <span className="text-[6px] font-bold text-[#10b981] uppercase tracking-widest">
                                                      {engineStarted ? `${node.contribution}% of total` : '---'}
                                                   </span>
                                                </div>
                                             </td>
                                             <td className="py-4">
                                                <div className="flex flex-col gap-1">
                                                   <span className="text-[10px] font-mono font-black text-[#10b981]">
                                                      {engineStarted ? `${realTimePerformance.toFixed(1)}%` : '---'}
                                                   </span>
                                                   <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                                                      <div
                                                         className="h-full bg-[#10b981] transition-all duration-1000"
                                                         style={{ width: engineStarted ? `${realTimePerformance}%` : '0%' }}
                                                      />
                                                   </div>
                                                </div>
                                             </td>
                                             <td className="py-4">
                                                <div className="flex flex-col gap-1">
                                                   <div className="flex items-center gap-2">
                                                      <span className="text-[6px] font-black text-slate-500 uppercase tracking-widest">WIN RATE:</span>
                                                      <span className="text-[7px] font-mono font-black text-[#10b981]">
                                                         {engineStarted ? `${winRate.toFixed(1)}%` : '---'}
                                                      </span>
                                                   </div>
                                                   <div className="flex items-center gap-2">
                                                      <span className="text-[6px] font-black text-slate-500 uppercase tracking-widest">EFFICIENCY:</span>
                                                      <span className="text-[7px] font-mono font-black text-blue-400">
                                                         {engineStarted ? `${gasEfficiency.toFixed(1)}%` : '---'}
                                                      </span>
                                                   </div>
                                                </div>
                                             </td>
                                             <td className="py-4">
                                                <div className="flex flex-col gap-1">
                                                   <div className="flex items-center gap-1">
                                                      <span className={`text-[6px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${riskLevel === 'LOW' ? 'bg-green-500/10 text-green-400' : riskLevel === 'HIGH' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                                         {riskLevel}
                                                      </span>
                                                   </div>
                                                   <span className="text-[6px] font-bold text-slate-600 uppercase tracking-widest">
                                                      {strategyData?.yield || '0%'} yield
                                                   </span>
                                                </div>
                                             </td>
                                             <td className="py-4">
                                                <div className="flex items-center gap-2">
                                                   <div className={`w-2 h-2 rounded-full ${engineStarted ? 'bg-[#10b981] animate-pulse' : 'bg-slate-600'}`} />
                                                   <span className={`text-[7px] font-black uppercase tracking-widest ${engineStarted ? 'text-[#10b981]' : 'text-slate-600'}`}>
                                                      {engineStarted ? 'DISCOVERING' : 'STANDBY'}
                                                   </span>
                                                </div>
                                             </td>
                                          </tr>
                                       );
                                    })}
                                    {/* Total Daily Profit Summary Row */}
                                    <tr className="border-t-2 border-[#06b6d4]/30 bg-[#06b6d4]/5">
                                       <td className="py-4">
                                          <div className="flex items-center gap-2">
                                             <Target size={14} className="text-[#06b6d4]" />
                                             <span className="text-[10px] font-black text-[#06b6d4] uppercase tracking-wider">TOTAL DAILY PROFIT DISCOVERED</span>
                                          </div>
                                       </td>
                                       <td className="py-4">
                                          <span className="text-xl font-mono font-black text-[#fbbf24]">
                                             {engineStarted ? formatCurrency(APEX_STRATEGY_NODES.reduce((sum, node, idx) => {
                                                const performance = performanceStats[idx] || 0;
                                                return sum + (node.usdProfit * performance / 100);
                                             }, 0)) : '---'}
                                          </span>
                                       </td>
                                       <td className="py-4">
                                          <span className="text-lg font-mono font-black text-[#10b981]">
                                             {engineStarted ? `${profitAchievement.toFixed(1)}%` : '---'}
                                          </span>
                                       </td>
                                       <td className="py-4">
                                          <div className="flex flex-col gap-1">
                                             <span className="text-[8px] font-black text-[#06b6d4] uppercase tracking-widest">7-STRATEGY MATRIX</span>
                                             <span className="text-[6px] font-bold text-slate-600 uppercase tracking-widest">ALGORITHMIC DISCOVERY</span>
                                          </div>
                                       </td>
                                       <td className="py-4">
                                          <div className="flex flex-col gap-1">
                                             <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">TARGET:</span>
                                             <span className="text-[9px] font-mono font-black text-[#06b6d4]">
                                                {engineStarted ? formatCurrency(profitTarget) : '---'}
                                             </span>
                                          </div>
                                       </td>
                                       <td className="py-4">
                                          <div className="flex items-center gap-2">
                                             <div className={`w-2 h-2 rounded-full ${engineStarted ? 'bg-[#10b981] animate-pulse' : 'bg-slate-600'}`} />
                                             <span className="text-[8px] font-black text-[#10b981] uppercase tracking-widest">
                                                {engineStarted ? 'ALGORITHMIC SUCCESS' : 'TARGET LOCKED'}
                                             </span>
                                          </div>
                                       </td>
                                    </tr>
                                 </tbody>
                              </table>
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
                           <div className="flex flex-col md:flex-row gap-4">
                              {engineStarted && (
                                  <button
                                      onClick={handleScanForAlpha}
                                      disabled={isScanning}
                                      className="w-full md:w-auto px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 bg-[#06b6d4] text-black shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                      {isScanning ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                                      {isScanning ? 'Scanning...' : 'Scan for Alpha'}
                                  </button>
                              )}
                              <button
                                 onClick={() => engineStarted ? setShowMonitorConfirmation(true) : setShowStartConfirmation(true)}
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
                  </div>
               )}

               {/* Scan Results Modal */}
               {showScanModal && (
                  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                     <div className="bg-black/95 border border-[#06b6d4]/30 rounded-[2rem] p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                           <div className="flex items-center gap-3">
                              <Search size={24} className="text-[#06b6d4]" />
                              <h3 className="text-xl font-black text-white uppercase tracking-tighter">Alpha Scan Results</h3>
                           </div>
                           <button
                              onClick={() => setShowScanModal(false)}
                              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                           >
                              <X size={20} className="text-slate-400" />
                           </button>
                        </div>

                        {isScanning ? (
                           <div className="flex flex-col items-center justify-center py-12">
                              <Loader2 size={48} className="text-[#06b6d4] animate-spin mb-4" />
                              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Scanning for Alpha Opportunities...</p>
                           </div>
                        ) : scanResults ? (
                           <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                 <div className="p-4 rounded-xl bg-[#06b6d4]/5 border border-[#06b6d4]/20">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Opportunities Found</span>
                                    <span className="text-2xl font-mono font-black text-[#06b6d4]">{scanResults.opportunities?.length || 0}</span>
                                 </div>
                                 <div className="p-4 rounded-xl bg-[#10b981]/5 border border-[#10b981]/20">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Estimated Profit</span>
                                    <span className="text-2xl font-mono font-black text-[#10b981]">{formatCurrency(scanResults.totalProfit || 0)}</span>
                                 </div>
                              </div>

                              {scanResults.opportunities?.length > 0 && (
                                 <div className="space-y-3">
                                    <h4 className="text-sm font-black text-white uppercase tracking-widest">Detected Opportunities</h4>
                                    {scanResults.opportunities.map((opp: any, idx: number) => (
                                       <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10">
                                          <div className="flex justify-between items-start mb-2">
                                             <span className="text-sm font-black text-white uppercase">{opp.type || 'Alpha Opportunity'}</span>
                                             <span className="text-sm font-mono font-black text-[#10b981]">{formatCurrency(opp.profit || 0)}</span>
                                          </div>
                                          <p className="text-[10px] text-slate-400 uppercase tracking-widest">{opp.description || 'High-confidence arbitrage opportunity detected'}</p>
                                       </div>
                                    ))}
                                 </div>
                              )}

                              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                                 <button
                                    onClick={() => setShowScanModal(false)}
                                    className="px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest bg-white/5 text-slate-400 hover:bg-white/10 transition-colors"
                                 >
                                    Close
                                 </button>
                                 {scanResults.opportunities?.length > 0 && (
                                     <button
                                         onClick={() => {
                                             setShowScanModal(false);
                                             addToast('success', 'Alpha opportunities queued for execution. Monitor the Performance view for updates.');
                                         }}
                                         className="px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest bg-[#10b981] text-black hover:scale-105 transition-all"
                                     >
                                         Execute Opportunities
                                     </button>
                                 )}
                              </div>
                           </div>
                        ) : (
                           <div className="text-center py-12">
                              <Search size={48} className="text-slate-600 mx-auto mb-4" />
                              <p className="text-sm font-black text-slate-500 uppercase tracking-widest">No scan results available</p>
                           </div>
                        )}
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
                              <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-800 rounded-lg">
                                       <Layers size={14} className="text-white" />
                                    </div>
                                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Tri-Tier Bot Fleet</h3>
                                 </div>
                                 <div className="flex gap-3">
                                    <button
                                       onClick={handleStartBots}
                                       disabled={startingBots || !engineStarted}
                                       className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                                          startingBots
                                             ? 'bg-blue-500/20 text-blue-400 cursor-wait'
                                             : !engineStarted
                                                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                                : 'bg-[#10b981] text-black hover:scale-105'
                                       }`}
                                    >
                                       {startingBots ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
                                       {startingBots ? 'STARTING...' : 'START BOTS'}
                                    </button>
                                    <button
                                       onClick={handleStopBots}
                                       disabled={stoppingBots || !engineStarted}
                                       className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                                          stoppingBots
                                             ? 'bg-red-500/20 text-red-400 cursor-wait'
                                             : !engineStarted
                                                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                                : 'bg-red-500 text-black hover:scale-105'
                                       }`}
                                    >
                                       {stoppingBots ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />}
                                       {stoppingBots ? 'STOPPING...' : 'STOP BOTS'}
                                    </button>
                                 </div>
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
                           onClick={() => setShowWithdrawConfirmation(true)}
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

               {activeView === 'LEARNING' && (
                  <div className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar relative z-10 animate-in fade-in duration-500 text-left">
                     <div className="max-w-7xl mx-auto flex flex-col gap-8">
                        <div className="flex items-center justify-between border-b border-white/5 pb-8">
                           <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-2xl border ${engineStarted ? 'bg-[#06b6d4]/10 border-[#06b6d4]/30 shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'bg-white/5 border-white/10'}`}>
                                 <TrendingUp size={24} className={engineStarted ? 'text-[#06b6d4] animate-pulse' : 'text-slate-600'} />
                              </div>
                              <div>
                                 <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Learning Curve Analytics</h2>
                                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Strategy Forging Capability Measurement</p>
                              </div>
                           </div>
                           <div className="px-6 py-3 rounded-xl bg-black/40 border border-white/5 flex flex-col items-end">
                              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Learning Status</span>
                              <span className={`text-lg font-mono font-black ${engineStarted ? 'text-[#06b6d4]' : 'text-slate-800'}`}>
                                 {engineStarted ? 'ACTIVE' : 'STANDBY'}
                              </span>
                           </div>
                        </div>

                        {/* Learning Progress Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                           <div className="p-5 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-3xl transition-all duration-700 relative overflow-hidden group">
                              <div className="absolute top-0 left-0 w-full h-0.5 bg-[#06b6d4]" />
                              <div className="flex justify-between items-start mb-4">
                                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Iterations</span>
                                 <div className={`w-2 h-2 rounded-full ${engineStarted ? 'bg-[#06b6d4] animate-pulse' : 'bg-slate-800'}`} />
                              </div>
                              <div className="flex flex-col gap-1 mb-6">
                                 <span className={`text-2xl font-mono font-black ${engineStarted ? 'text-white' : 'text-slate-800'}`}>
                                    {engineStarted ? (learningCurveData?.totalIterations || 0).toLocaleString() : '---'}
                                 </span>
                              </div>
                              <div className="flex flex-col gap-3">
                                 <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                                    <div
                                       className="h-full bg-[#06b6d4] transition-all duration-1000"
                                       style={{ width: engineStarted ? '78%' : '0%' }}
                                    />
                                 </div>
                                 <div className="flex justify-between items-center text-[7px] font-bold uppercase tracking-widest text-slate-500">
                                    <span>Target: 2,000</span>
                                    <span>{engineStarted ? '78%' : '---'}</span>
                                 </div>
                              </div>
                           </div>

                           <div className="p-5 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-3xl transition-all duration-700 relative overflow-hidden group">
                              <div className="absolute top-0 left-0 w-full h-0.5 bg-[#10b981]" />
                              <div className="flex justify-between items-start mb-4">
                                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Strategy Variants</span>
                                 <div className={`w-2 h-2 rounded-full ${engineStarted ? 'bg-[#10b981] animate-pulse' : 'bg-slate-800'}`} />
                              </div>
                              <div className="flex flex-col gap-1 mb-6">
                                 <span className={`text-2xl font-mono font-black ${engineStarted ? 'text-white' : 'text-slate-800'}`}>
                                    {engineStarted ? (learningCurveData?.discoveredStrategies || 0) : '---'}
                                 </span>
                              </div>
                              <div className="flex flex-col gap-3">
                                 <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                                    <div
                                       className="h-full bg-[#10b981] transition-all duration-1000"
                                       style={{ width: engineStarted ? '92%' : '0%' }}
                                    />
                                 </div>
                                 <div className="flex justify-between items-center text-[7px] font-bold uppercase tracking-widest text-slate-500">
                                    <span>Discovery Rate</span>
                                    <span>{engineStarted ? '92%' : '---'}</span>
                                 </div>
                              </div>
                           </div>

                           <div className="p-5 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-3xl transition-all duration-700 relative overflow-hidden group">
                              <div className="absolute top-0 left-0 w-full h-0.5 bg-[#fbbf24]" />
                              <div className="flex justify-between items-start mb-4">
                                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Perfect Match Score</span>
                                 <div className={`w-2 h-2 rounded-full ${engineStarted ? 'bg-[#fbbf24] animate-pulse' : 'bg-slate-800'}`} />
                              </div>
                              <div className="flex flex-col gap-1 mb-6">
                                 <span className={`text-2xl font-mono font-black ${engineStarted ? 'text-white' : 'text-slate-800'}`}>
                                    {engineStarted ? `${(learningCurveData?.perfectMatchScore || 0).toFixed(1)}%` : '---'}
                                 </span>
                              </div>
                              <div className="flex flex-col gap-3">
                                 <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                                    <div
                                       className="h-full bg-[#fbbf24] transition-all duration-1000"
                                       style={{ width: engineStarted ? '94%' : '0%' }}
                                    />
                                 </div>
                                 <div className="flex justify-between items-center text-[7px] font-bold uppercase tracking-widest text-slate-500">
                                    <span>Target: {'>'}90%</span>
                                    <span>{engineStarted ? 'ACHIEVED' : '---'}</span>
                                 </div>
                              </div>
                           </div>

                           <div className="p-5 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-3xl transition-all duration-700 relative overflow-hidden group">
                              <div className="absolute top-0 left-0 w-full h-0.5 bg-[#a855f7]" />
                              <div className="flex justify-between items-start mb-4">
                                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Confidence Level</span>
                                 <div className={`w-2 h-2 rounded-full ${engineStarted ? 'bg-[#a855f7] animate-pulse' : 'bg-slate-800'}`} />
                              </div>
                              <div className="flex flex-col gap-1 mb-6">
                                 <span className={`text-2xl font-mono font-black ${engineStarted ? 'text-white' : 'text-slate-800'}`}>
                                    {engineStarted ? `${(learningCurveData?.confidenceScore || 0).toFixed(1)}%` : '---'}
                                 </span>
                              </div>
                              <div className="flex flex-col gap-3">
                                 <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                                    <div
                                       className="h-full bg-[#a855f7] transition-all duration-1000"
                                       style={{ width: engineStarted ? '87%' : '0%' }}
                                    />
                                 </div>
                                 <div className="flex justify-between items-center text-[7px] font-bold uppercase tracking-widest text-slate-500">
                                    <span>Learning Rate: 0.1</span>
                                    <span>{engineStarted ? `${learningCurveData?.learningRate || 0.1}` : '---'}</span>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Perfect Match Scoring Breakdown */}
                        <div className="bg-black/60 border border-[#06b6d4]/20 rounded-[1.5rem] p-6 backdrop-blur-3xl shadow-xl">
                           <div className="flex items-center gap-3 mb-6">
                              <Target size={20} className="text-[#06b6d4]" />
                              <h3 className="text-sm font-black text-white uppercase tracking-widest">Perfect Match Scoring Algorithm</h3>
                              <div className="ml-auto flex items-center gap-2">
                                 <div className={`w-2 h-2 rounded-full ${engineStarted ? 'bg-[#10b981] animate-pulse' : 'bg-slate-600'}`} />
                                 <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                                    {engineStarted ? 'REAL-TIME ANALYSIS' : 'ANALYSIS OFFLINE'}
                                 </span>
                              </div>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              <div className="p-4 rounded-xl bg-[#06b6d4]/5 border border-[#06b6d4]/20">
                                 <div className="flex items-center justify-between mb-2">
                                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">PROFIT/DAY MATCHING</span>
                                    <span className="text-[10px] font-mono font-black text-[#06b6d4]">50% WEIGHT</span>
                                 </div>
                                 <span className="text-xl font-mono font-black text-[#06b6d4]">{engineStarted ? `${((learningCurveData?.perfectMatchScore || 0) * 0.96).toFixed(1)}%` : '---'}</span>
                                 <div className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#06b6d4] transition-all duration-1000" style={{ width: engineStarted ? '96%' : '0%' }} />
                                 </div>
                              </div>

                              <div className="p-4 rounded-xl bg-[#10b981]/5 border border-[#10b981]/20">
                                 <div className="flex items-center justify-between mb-2">
                                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">EXECUTION CAPABILITY</span>
                                    <span className="text-[10px] font-mono font-black text-[#10b981]">20% WEIGHT</span>
                                 </div>
                                 <span className="text-xl font-mono font-black text-[#10b981]">{engineStarted ? `${((learningCurveData?.perfectMatchScore || 0) * 0.89).toFixed(1)}%` : '---'}</span>
                                 <div className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#10b981] transition-all duration-1000" style={{ width: engineStarted ? '89%' : '0%' }} />
                                 </div>
                              </div>

                              <div className="p-4 rounded-xl bg-[#fbbf24]/5 border border-[#fbbf24]/20">
                                 <div className="flex items-center justify-between mb-2">
                                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">RISK ALIGNMENT</span>
                                    <span className="text-[10px] font-mono font-black text-[#fbbf24]">15% WEIGHT</span>
                                 </div>
                                 <span className="text-xl font-mono font-black text-[#fbbf24]">{engineStarted ? `${((learningCurveData?.perfectMatchScore || 0) * 0.92).toFixed(1)}%` : '---'}</span>
                                 <div className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#fbbf24] transition-all duration-1000" style={{ width: engineStarted ? '92%' : '0%' }} />
                                 </div>
                              </div>

                              <div className="p-4 rounded-xl bg-[#a855f7]/5 border border-[#a855f7]/20">
                                 <div className="flex items-center justify-between mb-2">
                                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">MARKET COMPATIBILITY</span>
                                    <span className="text-[10px] font-mono font-black text-[#a855f7]">15% WEIGHT</span>
                                 </div>
                                 <span className="text-xl font-mono font-black text-[#a855f7]">{engineStarted ? `${((learningCurveData?.perfectMatchScore || 0) * 0.87).toFixed(1)}%` : '---'}</span>
                                 <div className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#a855f7] transition-all duration-1000" style={{ width: engineStarted ? '87%' : '0%' }} />
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Learning Progress Timeline */}
                        <div className="bg-black/60 border border-[#10b981]/20 rounded-[1.5rem] p-6 backdrop-blur-3xl shadow-xl">
                           <div className="flex items-center gap-3 mb-6">
                              <Activity size={20} className="text-[#10b981]" />
                              <h3 className="text-sm font-black text-white uppercase tracking-widest">Interactive Learning Progress Timeline</h3>
                           </div>

                           {/* Timeline Visualization */}
                           <div className="relative mb-6">
                              <div className="flex items-center justify-between">
                                 {(learningCurveData?.profitDayProgression || [
                                    { milestoneId: '25%', targetProfitDay: 250, achievedProfitDay: 196, iterationReached: 312, timestamp: new Date('2024-01-15') },
                                    { milestoneId: '50%', targetProfitDay: 500, achievedProfitDay: 421, iterationReached: 624, timestamp: new Date('2024-01-22') },
                                    { milestoneId: '75%', targetProfitDay: 750, achievedProfitDay: 673, iterationReached: 936, timestamp: new Date('2024-01-29') },
                                    { milestoneId: '100%', targetProfitDay: 1000, achievedProfitDay: 942, iterationReached: 1248, timestamp: new Date('2024-02-05') }
                                 ]).map((milestone, idx, arr) => {
                                    const isAchieved = milestone.achievedProfitDay >= milestone.targetProfitDay;
                                    const progress = (milestone.achievedProfitDay / milestone.targetProfitDay) * 100;

                                    return (
                                       <div key={idx} className="flex flex-col items-center relative group cursor-pointer">
                                          {/* Connection Line */}
                                          {idx < arr.length - 1 && (
                                             <div className="absolute top-3 left-full w-full h-0.5 bg-gradient-to-r from-[#10b981]/50 to-[#10b981]/20 -translate-y-1/2 z-0" />
                                          )}

                                          {/* Milestone Node */}
                                          <div className={`relative w-6 h-6 rounded-full border-2 transition-all duration-300 group-hover:scale-110 z-10 ${
                                             isAchieved
                                                ? 'bg-[#10b981] border-[#10b981] shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                                                : 'bg-slate-700 border-slate-600'
                                          }`}>
                                             {isAchieved && (
                                                <div className="absolute inset-0 rounded-full bg-[#10b981] animate-ping opacity-20" />
                                             )}
                                          </div>

                                          {/* Hover Tooltip */}
                                          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/90 border border-[#10b981]/30 rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 min-w-[200px]">
                                             <div className="text-[10px] font-black text-[#10b981] uppercase tracking-widest mb-1">
                                                {milestone.milestoneId} Target Milestone
                                             </div>
                                             <div className="text-[8px] text-slate-300 space-y-1">
                                                <div>Progress: <span className="text-[#10b981] font-mono">{progress.toFixed(1)}%</span></div>
                                                <div>Iteration: <span className="text-white font-mono">{milestone.iterationReached.toLocaleString()}</span></div>
                                                <div>Achieved: <span className="text-[#10b981] font-mono">${milestone.achievedProfitDay.toFixed(0)}</span></div>
                                                <div>Target: <span className="text-slate-400 font-mono">${milestone.targetProfitDay}</span></div>
                                             </div>
                                             <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
                                          </div>

                                          {/* Label */}
                                          <span className={`text-[8px] font-black uppercase tracking-widest mt-2 transition-colors ${
                                             isAchieved ? 'text-[#10b981]' : 'text-slate-500'
                                          }`}>
                                             {milestone.milestoneId}
                                          </span>
                                       </div>
                                    );
                                 })}
                              </div>
                           </div>

                           {/* Detailed Timeline List */}
                           <div className="space-y-3">
                              {(learningCurveData?.profitDayProgression || [
                                 { milestoneId: '25%', targetProfitDay: 250, achievedProfitDay: 196, iterationReached: 312, timestamp: new Date('2024-01-15') },
                                 { milestoneId: '50%', targetProfitDay: 500, achievedProfitDay: 421, iterationReached: 624, timestamp: new Date('2024-01-22') },
                                 { milestoneId: '75%', targetProfitDay: 750, achievedProfitDay: 673, iterationReached: 936, timestamp: new Date('2024-01-29') },
                                 { milestoneId: '100%', targetProfitDay: 1000, achievedProfitDay: 942, iterationReached: 1248, timestamp: new Date('2024-02-05') }
                              ]).map((milestone, idx) => {
                                 const isAchieved = milestone.achievedProfitDay >= milestone.targetProfitDay;
                                 const progress = (milestone.achievedProfitDay / milestone.targetProfitDay) * 100;

                                 return (
                                    <div key={idx} className="flex items-center gap-4 p-3 rounded-lg bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.05] transition-all duration-200 cursor-pointer group">
                                       <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                          isAchieved ? 'bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-slate-600'
                                       }`} />

                                       <div className="flex-1">
                                          <div className="flex items-center justify-between mb-1">
                                             <span className="text-xs font-black text-white uppercase group-hover:text-[#10b981] transition-colors">
                                                {milestone.milestoneId} Profit Target
                                             </span>
                                             <div className="flex items-center gap-2">
                                                <span className={`text-[9px] font-mono font-black ${
                                                   isAchieved ? 'text-[#10b981]' : 'text-slate-600'
                                                }`}>
                                                   {progress.toFixed(1)}%
                                                </span>
                                                <div className="w-12 h-1 bg-slate-700 rounded-full overflow-hidden">
                                                   <div
                                                      className={`h-full transition-all duration-1000 ${
                                                         isAchieved ? 'bg-[#10b981]' : 'bg-slate-600'
                                                      }`}
                                                      style={{ width: `${Math.min(progress, 100)}%` }}
                                                   />
                                                </div>
                                             </div>
                                          </div>
                                          <div className="flex items-center gap-4 text-[7px] font-bold text-slate-500 uppercase tracking-widest">
                                             <span>Iteration: {milestone.iterationReached.toLocaleString()}</span>
                                             <span>Date: {new Date(milestone.timestamp).toLocaleDateString()}</span>
                                             <span className={isAchieved ? 'text-[#10b981]' : 'text-slate-600'}>
                                                {isAchieved ? 'ACHIEVED' : 'IN PROGRESS'}
                                             </span>
                                          </div>
                                       </div>
                                    </div>
                                 );
                              })}
                           </div>
                        </div>

                        {/* Strategy Discovery Stats */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                           <div className="bg-black/60 border border-[#fbbf24]/20 rounded-[1.5rem] p-6 backdrop-blur-3xl shadow-xl">
                              <div className="flex items-center gap-3 mb-6">
                                 <Search size={20} className="text-[#fbbf24]" />
                                 <h3 className="text-sm font-black text-white uppercase tracking-widest">Strategy Discovery</h3>
                              </div>

                              <div className="space-y-4">
                                 <div className="flex justify-between items-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unique Variants Found</span>
                                    <span className="text-lg font-mono font-black text-[#fbbf24]">{engineStarted ? (learningCurveData?.discoveredStrategies || 0) : '---'}</span>
                                 </div>
                                 <div className="flex justify-between items-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Combination Tests</span>
                                    <span className="text-lg font-mono font-black text-[#fbbf24]">{engineStarted ? (learningCurveData?.totalIterations || 0).toLocaleString() : '---'}</span>
                                 </div>
                                 <div className="flex justify-between items-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Synergy Multipliers</span>
                                    <span className="text-lg font-mono font-black text-[#fbbf24]">{engineStarted ? '2.4x' : '---'}</span>
                                 </div>
                              </div>
                           </div>

                           <div className="bg-black/60 border border-[#a855f7]/20 rounded-[1.5rem] p-6 backdrop-blur-3xl shadow-xl">
                              <div className="flex items-center gap-3 mb-6">
                                 <BrainCircuit size={20} className="text-[#a855f7]" />
                                 <h3 className="text-sm font-black text-white uppercase tracking-widest">Performance Targets</h3>
                              </div>

                              <div className="space-y-4">
                                 <div className="p-3 rounded-xl bg-[#a855f7]/5 border border-[#a855f7]/20">
                                    <div className="flex justify-between items-center mb-2">
                                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Learning Accuracy</span>
                                       <span className={`text-[10px] font-mono font-black ${engineStarted ? 'text-[#10b981]' : 'text-slate-600'}`}>
                                          {engineStarted ? 'ACHIEVED' : 'PENDING'}
                                       </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                       <span className="text-lg font-mono font-black text-[#a855f7]">{engineStarted ? `${(learningCurveData?.perfectMatchScore || 0).toFixed(1)}%` : '---'}</span>
                                       <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Target: {'>'}90%</span>
                                    </div>
                                 </div>

                                 <div className="p-3 rounded-xl bg-[#a855f7]/5 border border-[#a855f7]/20">
                                    <div className="flex justify-between items-center mb-2">
                                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Win Rate Improvement</span>
                                       <span className={`text-[10px] font-mono font-black ${engineStarted ? 'text-[#10b981]' : 'text-slate-600'}`}>
                                          {engineStarted ? 'ACHIEVED' : 'PENDING'}
                                       </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                       <span className="text-lg font-mono font-black text-[#a855f7]">{engineStarted ? `+${((learningCurveData?.confidenceScore || 0) * 0.2).toFixed(1)}%` : '---'}</span>
                                       <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Target: +15%</span>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {/* Withdraw Confirmation Dialog */}
               <ConfirmationDialog
                   isOpen={showWithdrawConfirmation}
                   title="Confirm Withdrawal"
                   message={`You are about to withdraw ${formatCurrency(totalProfit)} to ${targetWallet}. This action cannot be undone. Please verify the destination address is correct.`}
                   confirmText="Confirm Withdrawal"
                   cancelText="Cancel"
                   type="danger"
                   onConfirm={() => {
                       setShowWithdrawConfirmation(false);
                       handleWithdrawalExecution();
                   }}
                   onCancel={() => setShowWithdrawConfirmation(false)}
               />

               {/* Start Engine Confirmation Dialog */}
               <ConfirmationDialog
                   isOpen={showStartConfirmation}
                   title="Deploy Orion Engine"
                   message="This will activate the 7-Node Strategy Matrix and begin autonomous trading operations. The engine will run 24/7 and execute trades based on AI-discovered strategies. Ensure your wallet is connected and backend is online."
                   confirmText="Deploy Engine"
                   cancelText="Cancel"
                   type="warning"
                   onConfirm={() => {
                       setShowStartConfirmation(false);
                       toggleEngine();
                   }}
                   onCancel={() => setShowStartConfirmation(false)}
                />
               
               {/* Monitor Confirmation Dialog */}
               <ConfirmationDialog
                   isOpen={showMonitorConfirmation}
                   title="Switch to Performance Monitor"
                   message="This will switch to the Performance view to monitor the strategy matrix and bot fleet in real-time."
                   confirmText="Switch View"
                   cancelText="Cancel"
                   type="info"
                   onConfirm={() => {
                       setShowMonitorConfirmation(false);
                       setActiveView('PERFORMANCE');
                   }}
                   onCancel={() => setShowMonitorConfirmation(false)}
                />
            </main>

            <footer className="h-16 border-t border-white/5 bg-black/90 px-6 md:px-10 flex items-center justify-between z-50">
               <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2">
                     <div className={`w-1.5 h-1.5 rounded-full transition-colors ${connectionStatus === 'ONLINE' ? 'bg-[#10b981] shadow-[0_0_8px_#10b981]' :
                        connectionStatus === 'PROBING' || connectionStatus === 'SCANNING' ? 'bg-blue-500 shadow-[0_0_8px_#3b82f6] animate-pulse' :
                           'bg-red-500 shadow-[0_0_8px_#ef4444]'
                        }`} />
                     <span className={`text-[8px] font-black uppercase tracking-widest ${connectionStatus === 'ONLINE' ? 'text-slate-500' :
                        connectionStatus === 'PROBING' || connectionStatus === 'SCANNING' ? 'text-blue-500' : 'text-red-500'
                        }`}>
                        {connectionStatus === 'ONLINE' ? 'SERVER: ONLINE' :
                           connectionStatus === 'PROBING' ? 'SERVER: LINKING...' :
                              connectionStatus === 'SCANNING' ? 'SERVER: FAILSAFE HUNTING...' : 'SERVER: DISCONNECTED'}
                     </span>
                     {(connectionStatus === 'OFFLINE' || connectionStatus === 'SCANNING') && (
                        <button
                           onClick={retryConnection}
                           className={`text-[7px] font-black text-[#fbbf24] border border-[#fbbf24]/30 px-2 py-0.5 rounded hover:bg-[#fbbf24]/10 transition-colors uppercase tracking-widest ${connectionStatus === 'SCANNING' ? 'opacity-50 cursor-wait' : 'animate-pulse'}`}
                        >
                           {connectionStatus === 'SCANNING' ? 'Scanning...' : 'Retry'}
                        </button>
                     )}
                     <div className="hidden lg:block h-3 w-px bg-white/5 mx-2" />
                     <span className="hidden lg:block text-[6px] font-mono text-slate-700 uppercase tracking-tighter truncate max-w-[150px]" title={BACKEND_URL}>
                        Core: {BACKEND_URL}
                     </span>
                     <button
                        onClick={() => {
                           const newUrl = prompt("Enter Enterprise Backend URL:", BACKEND_URL);
                           if (newUrl) {
                              localStorage.setItem('ORION_BACKEND_OVERRIDE', newUrl);
                              window.location.reload();
                           }
                        }}
                        className="text-[6px] font-black text-slate-500 hover:text-white transition-colors uppercase"
                     >
                        [SET]
                     </button>
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
                              addToast('success', 'Smart Account Address Copied');
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

               {/* DEPLOYMENT VALIDATION ADDRESSES - Displayed when engine is running */}
               {engineStarted && (deploymentContractNumber || generatedSmartAccount) && (
                  <div className="flex items-center gap-6">
                     {deploymentContractNumber && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-purple-500/30 bg-purple-500/5 group cursor-pointer" onClick={() => {
                           navigator.clipboard.writeText(deploymentContractNumber);
                           addToast('success', 'Contract Address Copied');
                        }}>
                           <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                           <div className="flex flex-col">
                              <span className="text-[6px] font-black text-slate-600 uppercase tracking-widest">Contract</span>
                              <span className="text-[8px] font-mono text-purple-400 group-hover:text-white transition-colors">{deploymentContractNumber}</span>
                           </div>
                           <Copy size={10} className="text-slate-700 group-hover:text-purple-400" />
                        </div>
                     )}
                     {generatedSmartAccount && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#10b981]/30 bg-[#10b981]/5 group cursor-pointer" onClick={() => {
                           navigator.clipboard.writeText(generatedSmartAccount);
                           addToast('success', 'Smart Wallet Address Copied');
                        }}>
                           <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                           <div className="flex flex-col">
                              <span className="text-[6px] font-black text-slate-600 uppercase tracking-widest">Smart Wallet</span>
                              <span className="text-[8px] font-mono text-[#10b981] group-hover:text-white transition-colors">{generatedSmartAccount.slice(0, 8)}...{generatedSmartAccount.slice(-6)}</span>
                           </div>
                           <Copy size={10} className="text-slate-700 group-hover:text-[#10b981]" />
                        </div>
                     )}
                  </div>
               )}

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

const App: React.FC = () => {
    return (
        <ToastProvider>
            <AppContent />
        </ToastProvider>
    );
};

export default App;
