
import React, { useState, useMemo } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import EngineSystem from './pages/EngineSystem';
import ProfitAnalytics from './pages/ProfitAnalytics';
import Strategies from './pages/Strategies';
import Registry from './pages/Registry';
import Withdrawal from './pages/Withdrawal';
import TradeAnalytics from './pages/TradeAnalytics';
import AITerminal from './pages/AITerminal';
import Logs from './pages/Logs';
import ProjectProgress from './pages/ProjectProgress';
import { NAV_ITEMS } from './constants';
import { DeploymentRecord } from './types';

const initialRecords: DeploymentRecord[] = [
  { id: 'd1', smartWalletAddress: '0x1234...abcd', contractNumber: 'C-001-ARB', blockchain: 'Arbitrum', infrastructure: 'Google Cloud', timestamp: '2024-07-29 10:00:00 UTC', status: 'Active' },
  { id: 'd2', smartWalletAddress: '0x5678...efgh', contractNumber: 'C-002-BASE', blockchain: 'Base', infrastructure: 'Google Cloud', timestamp: '2024-07-28 15:30:00 UTC', status: 'Active' },
];

const App: React.FC = () => {
  const [currency, setCurrency] = useState<'ETH' | 'USD'>('USD');
  const [refreshInterval, setRefreshInterval] = useState<number>(5000);
  const location = useLocation();

  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isEngineRunning, setIsEngineRunning] = useState(false);
  const [deploymentRecords, setDeploymentRecords] = useState<DeploymentRecord[]>(initialRecords);

  const activePage = useMemo(() => {
    return NAV_ITEMS.find(item => item.path === location.pathname)?.label || 'Engine';
  }, [location.pathname]);

  const handleDeploy = (selectedAccount: string) => {
    setIsDeploying(true);
    setTimeout(() => {
      const newRecord: DeploymentRecord = {
        id: `d${deploymentRecords.length + 1}`,
        smartWalletAddress: `${selectedAccount.slice(0, 6)}...${selectedAccount.slice(-4)}`,
        contractNumber: `C-00${deploymentRecords.length + 2}-ARB`,
        blockchain: 'Arbitrum',
        infrastructure: 'Google Cloud',
        timestamp: new Date().toUTCString(),
        status: 'Active',
      };
      setDeploymentRecords(prev => [newRecord, ...prev]);
      setIsDeploying(false);
      setIsEngineRunning(true);
    }, 2500);
  };

  const handleConnect = (selectedAccount: string) => {
    // Final validation guard before starting the engine
    if (!/^0x[a-fA-F0-9]{40}$/.test(selectedAccount)) {
        alert("CRITICAL ERROR: Invalid wallet address passed to main app state. Aborting.");
        return;
    }
    setAccount(selectedAccount);
    setIsConnected(true);
    handleDeploy(selectedAccount);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setAccount(null);
    setIsEngineRunning(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 font-sans">
      <Header
        currency={currency}
        setCurrency={setCurrency}
        refreshInterval={refreshInterval}
        setRefreshInterval={setRefreshInterval}
        activePage={activePage}
        isConnected={isConnected}
        isDeploying={isDeploying}
        isEngineRunning={isEngineRunning}
        account={account}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<EngineSystem />} />
          <Route path="/profit-analytics" element={<ProfitAnalytics currency={currency} refreshInterval={refreshInterval} />} />
          <Route path="/trade-analytics" element={<TradeAnalytics />} />
          <Route path="/strategies" element={<Strategies currency={currency} />} />
          <Route path="/project-progress" element={<ProjectProgress />} />
          <Route path="/registry" element={<Registry records={deploymentRecords} />} />
          <Route path="/ai-terminal" element={<AITerminal />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/withdrawal" element={<Withdrawal />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
