
import React, { useState, useEffect } from 'react';
import { Cpu, Wifi, ShieldCheck, Download, LogOut, RefreshCw, Zap, ArrowRightLeft, Clipboard, CheckCircle2 } from 'lucide-react';
import { WalletState, WithdrawalMode } from '../types';

interface Props {
  wallet: WalletState;
  totalProfit: number;
  withdrawable: number;
  onWithdraw: () => void;
  onUpdateWallet: (address: string) => Promise<void>;
  onSetConnecting: (val: boolean) => void;
  onDisconnect: () => void;
  withdrawMode: WithdrawalMode;
  setWithdrawMode: (mode: WithdrawalMode) => void;
  onManualAddressChange: (addr: string) => void;
  isProcessing: boolean;
}

const MetaMaskIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M29.5442 4.10214L17.7656 12.3392L16.0384 10.1557L7.33237 13.9213L16.2764 15.0001L17.0315 16.5186L18.1091 22.1384L21.3482 17.0601L29.5442 4.10214Z" fill="#E2761B"/>
    <path d="M2.45581 4.10214L14.2344 12.3392L15.9616 10.1557L24.6676 13.9213L15.7236 15.0001L14.9685 16.5186L13.8909 22.1384L10.6518 17.0601L2.45581 4.10214Z" fill="#E4761B"/>
    <path d="M26.2625 21.3813L21.3483 17.0602L18.1092 22.1385L16.4886 28.0811L15.8953 30L26.2625 21.3813Z" fill="#D7C1B3"/>
    <path d="M5.73752 21.3813L10.6517 17.0602L13.8908 22.1385L15.5114 28.0811L16.1047 30L5.73752 21.3813Z" fill="#D7C1B3"/>
    <path d="M16.2764 15.0001L17.0315 16.5186L18.1091 22.1384L21.3482 17.0601L16.2764 15.0001Z" fill="#233447"/>
    <path d="M15.7236 15.0001L14.9685 16.5186L13.8909 22.1384L10.6518 17.0601L15.7236 15.0001Z" fill="#233447"/>
    <path d="M29.5442 4.10214L17.7656 12.3392L29.5442 4.10214ZM2.45581 4.10214L14.2344 12.3392L2.45581 4.10214Z" fill="#CD7D32"/>
  </svg>
);

export const UnifiedCommandCard: React.FC<Props> = ({ 
  wallet, 
  totalProfit, 
  withdrawable, 
  onWithdraw, 
  onUpdateWallet, 
  onSetConnecting,
  onDisconnect,
  withdrawMode,
  setWithdrawMode,
  onManualAddressChange,
  isProcessing
}) => {
  const [currency, setCurrency] = useState<'USD' | 'ETH'>('USD');
  const [showPasteConfirm, setShowPasteConfirm] = useState(false);
  
  const ethPrice = 2500;
  const displayProfit = currency === 'USD' ? totalProfit : totalProfit / ethPrice;

  // Attempt to auto-detect account when user switches to AUTO-POPULATE mode
  useEffect(() => {
    if (withdrawMode === 'AUTO' && !wallet.isConnected && !wallet.isConnecting) {
      handleConnect(true); // silent check first
    }
  }, [withdrawMode]);

  const handleConnect = async (isSilent = false) => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) {
      if (!isSilent) window.open('https://metamask.io/download/', '_blank');
      return;
    }
    
    if (!isSilent) onSetConnecting(true);
    
    try {
      const method = isSilent ? 'eth_accounts' : 'eth_requestAccounts';
      const accounts = await ethereum.request({ method });
      if (Array.isArray(accounts) && accounts.length > 0) {
        await onUpdateWallet(accounts[0]);
      } else if (!isSilent) {
        onSetConnecting(false);
      }
    } catch (err: any) {
      console.error("MetaMask interaction error:", err);
      if (!isSilent) {
        onSetConnecting(false);
        if (err.code === 4001) {
          alert("Connection request was rejected by the user.");
        }
      }
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.startsWith('0x') && text.length >= 40) {
        onManualAddressChange(text);
        setShowPasteConfirm(true);
        setTimeout(() => setShowPasteConfirm(false), 2000);
      } else {
        alert("Invalid Ethereum address detected in clipboard.");
      }
    } catch (err) {
      alert("Failed to access clipboard. Please paste manually.");
    }
  };

  return (
    <div className="relative w-full min-h-[22rem] md:h-[24rem] rounded-[3rem] overflow-hidden bg-[#050505] border border-white/10 shadow-[0_60px_120px_-20px_rgba(0,0,0,1)] group transition-all duration-1000 select-none">
      {/* Premium Texture & Lighting */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/20 via-transparent to-zinc-950/80"></div>
      <div className="absolute inset-0 opacity-[0.05]" style={{backgroundImage: 'radial-gradient(#fff 0.8px, transparent 0)', backgroundSize: '15px 15px'}}></div>

      {/* Shimmer Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
        <div className="absolute top-0 left-[-150%] w-[100%] h-[300%] bg-white/5 skew-x-[45deg] animate-[shimmer_5s_infinite]"></div>
      </div>

      <div className="relative h-full p-8 md:p-10 flex flex-col justify-between z-10">
        
        {/* Top Bar */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-emerald-500 fill-emerald-500" />
              <span className="text-[12px] font-black tracking-[0.6em] text-zinc-100 uppercase italic">AION PLATINUM ELITE</span>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="relative p-3 bg-gradient-to-br from-yellow-400 via-yellow-600 to-orange-500 rounded-xl shadow-inner border border-white/40 overflow-hidden w-16 h-12 flex items-center justify-center">
                 <Cpu className="w-8 h-8 text-black/60" />
               </div>
               <Wifi className="w-6 h-6 text-zinc-700 rotate-90 opacity-40" />
            </div>
          </div>

          <div className="flex flex-col items-end gap-4">
             <div className="flex bg-black/60 backdrop-blur-xl p-1 rounded-full border border-white/10 shadow-lg">
                <button onClick={() => setCurrency('USD')} className={`px-4 py-1.5 text-[10px] font-black rounded-full transition-all ${currency === 'USD' ? 'bg-emerald-500 text-black' : 'text-zinc-500 hover:text-zinc-200'}`}>USD</button>
                <button onClick={() => setCurrency('ETH')} className={`px-4 py-1.5 text-[10px] font-black rounded-full transition-all ${currency === 'ETH' ? 'bg-emerald-500 text-black' : 'text-zinc-500 hover:text-zinc-200'}`}>ETH</button>
             </div>
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10">
               <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
               <span className="text-[9px] text-emerald-500/70 font-black tracking-[0.2em] uppercase">Secured by Etherscan</span>
             </div>
          </div>
        </div>

        {/* Real-time Balance */}
        <div className="flex flex-col my-4">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.4em] mb-1">Withdrawable Profit</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-4xl font-black text-white tracking-tighter mono drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              {displayProfit.toLocaleString('en-US', { 
                minimumFractionDigits: currency === 'USD' ? 2 : 4,
                maximumFractionDigits: currency === 'USD' ? 2 : 4 
              })}
            </span>
            <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{currency}</span>
          </div>
        </div>

        {/* Routing Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end pt-6 border-t border-white/10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Withdrawal Destination</span>
              <div className="flex bg-zinc-900/50 p-0.5 rounded-lg border border-white/5">
                <button 
                  onClick={() => setWithdrawMode('AUTO')} 
                  className={`px-3 py-1 text-[9px] font-black rounded transition-all ${withdrawMode === 'AUTO' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-zinc-600'}`}
                >
                  AUTO-POPULATE
                </button>
                <button 
                  onClick={() => setWithdrawMode('MANUAL')} 
                  className={`px-3 py-1 text-[9px] font-black rounded transition-all ${withdrawMode === 'MANUAL' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-zinc-600'}`}
                >
                  MANUAL ENTRY
                </button>
              </div>
            </div>

            {withdrawMode === 'AUTO' ? (
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                   <span className="text-sm md:text-xl font-mono text-zinc-300 tracking-[0.25em] drop-shadow-sm truncate max-w-[180px]">
                    {wallet.isConnected ? `**** **** **** ${wallet.address?.slice(-4)}` : '**** **** **** ****'}
                  </span>
                  {wallet.isConnected && (
                    <span className="text-[8px] text-emerald-500 font-black uppercase flex items-center gap-1 animate-pulse">
                      <CheckCircle2 className="w-2 h-2" /> Active MetaMask Detected
                    </span>
                  )}
                </div>
                {!wallet.isConnected && (
                   <button 
                    onClick={() => handleConnect(false)}
                    disabled={wallet.isConnecting}
                    className="p-2 hover:bg-white/5 rounded-full transition-all group/meta relative"
                    title="Scan for Wallet"
                  >
                     <MetaMaskIcon className={`w-8 h-8 transition-transform group-active/meta:scale-90 ${wallet.isConnecting ? 'animate-pulse grayscale opacity-50' : 'hover:scale-110'}`} />
                     <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-[#050505] rounded-full animate-bounce"></div>
                  </button>
                )}
              </div>
            ) : (
              <div className="relative group flex items-center gap-2">
                <input 
                  type="text"
                  placeholder="0x Ethereum Address"
                  className="w-full bg-black/40 border border-white/5 group-hover:border-white/20 focus:border-emerald-500/50 outline-none text-zinc-300 font-mono text-xs py-3 px-3 rounded-xl transition-all placeholder:text-zinc-800"
                  value={wallet.manualAddress || ''}
                  onChange={(e) => onManualAddressChange(e.target.value)}
                />
                <button 
                  onClick={handlePaste}
                  className="p-3 bg-zinc-900 border border-white/10 rounded-xl hover:bg-zinc-800 transition-all text-zinc-500 hover:text-white relative"
                  title="Paste from Clipboard"
                >
                  {showPasteConfirm ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Clipboard className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>

          {/* Action Area */}
          <div className="flex justify-end gap-3 w-full">
            <div className="flex flex-col items-end gap-2 w-full">
               <div className="flex gap-3 w-full">
                  <button 
                    onClick={onWithdraw}
                    disabled={isProcessing || withdrawable <= 0}
                    className={`flex-1 py-4 text-[12px] font-black uppercase rounded-[1.25rem] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.5)] ${
                      isProcessing 
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                        : withdrawable > 0 
                          ? 'bg-white hover:bg-zinc-200 text-black shadow-emerald-500/10' 
                          : 'bg-zinc-900 text-zinc-700 cursor-not-allowed'
                    }`}
                  >
                    {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRightLeft className="w-4 h-4" />}
                    WITHDRAW PROFIT
                  </button>
                  {wallet.isConnected && (
                    <button 
                      onClick={onDisconnect}
                      className="px-5 py-4 bg-zinc-900 border border-white/10 hover:bg-red-500/10 hover:border-red-500/40 text-zinc-500 hover:text-red-500 rounded-[1.25rem] transition-all"
                      title="Terminate Connection"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  )}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
