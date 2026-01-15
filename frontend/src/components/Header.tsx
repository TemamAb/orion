
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS, REFRESH_INTERVALS } from '../constants';
import { LogoIcon } from './icons/LogoIcon';
import { GearIcon } from './icons/GearIcon';
import Modal from './Modal';

interface HeaderProps {
  currency: 'ETH' | 'USD';
  setCurrency: (currency: 'ETH' | 'USD') => void;
  refreshInterval: number;
  setRefreshInterval: (interval: number) => void;
  activePage: string;
  isConnected: boolean;
  isDeploying: boolean;
  isEngineRunning: boolean;
  account: string | null;
  onConnect: (account: string) => void;
  onDisconnect: () => void;
}

const Header: React.FC<HeaderProps> = ({ currency, setCurrency, refreshInterval, setRefreshInterval, activePage, isConnected, isDeploying, isEngineRunning, account, onConnect, onDisconnect }) => {
  const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false);
  const [isEditDisconnect, setIsEditDisconnect] = useState(false);

  const handleConnectClick = async () => {
    if (!(window as any).ethereum || !(window as any).ethereum.isMetaMask) {
      alert('MetaMask not detected. Please install the MetaMask browser extension.');
      return;
    }

    try {
      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found. Please unlock MetaMask and create an account.");
      }

      const walletAddress = accounts[0];

      if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
        throw new Error(`Received invalid wallet address: ${walletAddress}`);
      }
      
      onConnect(walletAddress);

    } catch (error: any) {
      console.error("Wallet connection failed:", error);
      if (error.code === 4001) {
        alert("Connection request rejected. You must approve the connection in MetaMask to proceed.");
      } else {
        alert(`An error occurred: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    const handleAccountsChanged = (newAccounts: string[]) => {
      if (!isConnected) return;

      if (newAccounts.length === 0) {
        console.log("Wallet disconnected.");
        onDisconnect();
      } else if (account !== newAccounts[0]) {
        console.log("Account changed. Restarting engine with new account:", newAccounts[0]);
        onConnect(newAccounts[0]);
      }
    };

    if ((window as any).ethereum) {
      (window as any).ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if ((window as any).ethereum) {
        (window as any).ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [account, isConnected, onConnect, onDisconnect]);
  
  const renderConnectionStatus = () => {
    if (isDeploying) {
      return (
        <div className="bg-yellow-500/20 text-yellow-300 font-semibold py-2 px-4 rounded-md flex items-center space-x-2 text-sm">
          <GearIcon className="h-4 w-4 animate-spin" />
          <span>Deploying...</span>
        </div>
      );
    }
    if (isEngineRunning && account) {
      return (
        <div className="flex items-center space-x-2">
          <div className="bg-green-500/20 text-green-300 font-semibold py-2 px-3 rounded-md flex items-center space-x-2 text-sm">
            <GearIcon className="h-4 w-4 animate-spin" />
            <span>Engine Running</span>
          </div>
          <div className="bg-gray-800 p-2 rounded-md flex items-center space-x-2">
            <span className="text-xs font-mono text-cyan-400">{`${account.slice(0, 6)}...${account.slice(-4)}`}</span>
            {isEditDisconnect ? (
              <button onClick={() => setIsDisconnectModalOpen(true)} className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-1 px-2 rounded">
                Confirm
              </button>
            ) : (
              <button onClick={() => setIsEditDisconnect(true)} className="p-1 rounded-md hover:bg-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
        </div>
      );
    }
    return (
      <button onClick={handleConnectClick} className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 flex items-center space-x-2 text-sm">
        <span>Connect Wallet</span>
      </button>
    );
  };

  return (
    <>
      <Modal
        isOpen={isDisconnectModalOpen}
        onClose={() => { setIsDisconnectModalOpen(false); setIsEditDisconnect(false); }}
        title="Confirm Disconnection"
      >
        <p className="mb-4">Are you sure you want to disconnect your wallet and stop the engine? This will halt all active trading operations.</p>
        <div className="flex justify-end space-x-4">
            <button onClick={() => { setIsDisconnectModalOpen(false); setIsEditDisconnect(false); }} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-md transition-colors">Cancel</button>
            <button onClick={() => { onDisconnect(); setIsDisconnectModalOpen(false); setIsEditDisconnect(false); }} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md transition-colors">Disconnect</button>
        </div>
      </Modal>
      <header className="bg-gray-900/80 backdrop-blur-sm border-b border-cyan-500/20 sticky top-0 z-40 shadow-lg shadow-cyan-500/5">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <LogoIcon className="h-10 w-10 text-cyan-400" />
              <h1 className="text-xl font-bold text-white tracking-wider">
                Orion <span className="font-light text-cyan-400">Engine</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                  <p className="text-xs text-gray-400">Lifetime Profit</p>
                  <p className="text-base font-semibold text-green-400">$1,234,567.89</p>
              </div>
              <div className="flex items-center bg-gray-800 rounded-md p-1">
                <button onClick={() => setCurrency('ETH')} className={`px-3 py-1 text-xs rounded ${currency === 'ETH' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>ETH</button>
                <button onClick={() => setCurrency('USD')} className={`px-3 py-1 text-xs rounded ${currency === 'USD' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>USD</button>
              </div>
              <div className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5" /></svg>
                  <select value={refreshInterval} onChange={(e) => setRefreshInterval(Number(e.target.value))} className="bg-gray-800 border border-gray-700 text-white text-xs rounded-md focus:ring-cyan-500 focus:border-cyan-500 block w-full p-1.5">
                      {REFRESH_INTERVALS.map(item => (<option key={item.value} value={item.value}>{item.label}</option>))}
                  </select>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2 border-t border-gray-700/50 pt-2">
            <nav className="flex items-center space-x-4">
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.label} to={item.path} className={({ isActive }) => `py-2 px-3 text-sm font-medium rounded-md transition-colors duration-300 ${isActive ? 'bg-cyan-500/10 text-cyan-400' : 'text-gray-400 hover:bg-gray-800 hover:text-cyan-400'}`}>{item.label}</NavLink>
              ))}
            </nav>
            {renderConnectionStatus()}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
