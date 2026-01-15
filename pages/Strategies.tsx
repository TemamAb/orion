
import React, { useState, useMemo } from 'react';
import { Strategy } from '../types';
import ToggleSwitch from '../components/ToggleSwitch';
import ProgressBar from '../components/ProgressBar';
import Tooltip from '../components/Tooltip';

type SortDirection = 'ascending' | 'descending';
interface SortConfig {
  key: keyof Strategy | null;
  direction: SortDirection;
}

const initialStrategies: Strategy[] = [
  { id: 's1', name: 'Cross-DEX Arbitrage', totalWallets: 150, status: 'Active', alphaWalletsDetected: 25, avgPnlPerWallet: 120.50, totalPnl: 3012.50, forgingPrecision: 98.2, avgWinRate: 85.5, dailyProfitShare: 35.2, enabled: true, sourceOfTruth: { name: 'Nansen.ai', url: 'https://nansen.ai' } },
  { id: 's2', name: 'Triangular Arbitrage', totalWallets: 80, status: 'Active', alphaWalletsDetected: 12, avgPnlPerWallet: 250.75, totalPnl: 3009.00, forgingPrecision: 99.1, avgWinRate: 92.1, dailyProfitShare: 35.0, enabled: true, sourceOfTruth: { name: 'Arkham', url: 'https://arkhamintelligence.com' } },
  { id: 's3', name: 'Liquidation Arbitrage', totalWallets: 45, status: 'Active', alphaWalletsDetected: 5, avgPnlPerWallet: 310.00, totalPnl: 1550.00, forgingPrecision: 97.5, avgWinRate: 78.3, dailyProfitShare: 18.0, enabled: true, sourceOfTruth: { name: 'Dune Analytics', url: 'https://dune.com' } },
  { id: 's4', name: 'MEV Sandwich', totalWallets: 200, status: 'Inactive', alphaWalletsDetected: 30, avgPnlPerWallet: 55.20, totalPnl: 1656.00, forgingPrecision: 95.0, avgWinRate: 65.0, dailyProfitShare: 0, enabled: false, sourceOfTruth: { name: 'EigenPhi', url: 'https://eigenphi.io' } },
  { id: 's5', name: 'Flash Mint Arbitrage', totalWallets: 25, status: 'Active', alphaWalletsDetected: 2, avgPnlPerWallet: 450.00, totalPnl: 900.00, forgingPrecision: 99.8, avgWinRate: 95.2, dailyProfitShare: 10.5, enabled: true, sourceOfTruth: { name: 'Nansen.ai', url: 'https://nansen.ai' } },
  { id: 's6', name: 'Yield Farming Rotation', totalWallets: 300, status: 'Inactive', alphaWalletsDetected: 40, avgPnlPerWallet: 20.00, totalPnl: 800.00, forgingPrecision: 96.3, avgWinRate: 70.1, dailyProfitShare: 0, enabled: false, sourceOfTruth: { name: 'DeBank', url: 'https://debank.com' } },
  { id: 's7', name: 'NFT Floor Arbitrage', totalWallets: 60, status: 'Active', alphaWalletsDetected: 8, avgPnlPerWallet: 15.50, totalPnl: 124.00, forgingPrecision: 94.7, avgWinRate: 55.8, dailyProfitShare: 1.3, enabled: true, sourceOfTruth: { name: 'icy.tools', url: 'https://icy.tools' } },
];

const STRATEGY_COLORS: { [key: string]: string } = {
  's1': 'bg-cyan-400',
  's2': 'bg-blue-400',
  's3': 'bg-red-400',
  's4': 'bg-gray-500',
  's5': 'bg-purple-400',
  's6': 'bg-gray-500',
  's7': 'bg-yellow-400',
};

const Strategies: React.FC<{ currency: 'ETH' | 'USD' }> = ({ currency }) => {
  const [strategies, setStrategies] = useState<Strategy[]>(initialStrategies);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'totalPnl', direction: 'descending' });

  const handleScanForAlpha = (strategyId: string) => {
    setStrategies(prev =>
      prev.map(s => {
        if (s.id === strategyId) {
          return { ...s, alphaWalletsDetected: s.alphaWalletsDetected + 1 };
        }
        return s;
      })
    );
  };

  const sortedStrategies = useMemo(() => {
    let sortableItems = [...strategies];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key!];
        const valB = b[sortConfig.key!];
        if (valA < valB) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [strategies, sortConfig]);

  const requestSort = (key: keyof Strategy) => {
    let direction: SortDirection = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: keyof Strategy) => {
    if (sortConfig.key !== key) {
      return (
        <div className="flex flex-col opacity-30 group-hover:opacity-100 transition-opacity">
          <svg className="h-2 w-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg>
          <svg className="h-2 w-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
        </div>
      );
    }
    if (sortConfig.direction === 'ascending') {
      return (
        <svg className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
        </svg>
      );
    }
    return (
      <svg className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  const handleToggle = (id: string) => {
    setStrategies(prev =>
      prev.map(s => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const formatCurrency = (value: number) => {
    return currency === 'USD'
      ? `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : `Ξ${(value / 2000).toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`;
  };

  const totals = useMemo(() => {
    const activeStrategies = strategies.filter(s => s.enabled);
    return {
      totalWallets: strategies.reduce((sum, s) => sum + s.totalWallets, 0),
      alphaWalletsDetected: activeStrategies.reduce((sum, s) => sum + s.alphaWalletsDetected, 0),
      totalPnl: activeStrategies.reduce((sum, s) => sum + s.totalPnl, 0),
      avgForgingPrecision: activeStrategies.length > 0 ? activeStrategies.reduce((sum, s) => sum + s.forgingPrecision, 0) / activeStrategies.length : 0,
      avgWinRate: activeStrategies.length > 0 ? activeStrategies.reduce((sum, s) => sum + s.avgWinRate, 0) / activeStrategies.length : 0,
    };
  }, [strategies]);

  const dailyProfitTarget = 10000;

  const headers: { key: keyof Strategy | 'sourceOfTruth'; label: string; sortable: boolean, tooltip: string }[] = [
    { key: 'name', label: 'Strategy', sortable: true, tooltip: 'The name of the core arbitrage strategy.' },
    { key: 'status', label: 'Status', sortable: true, tooltip: 'Current operational status of the strategy.' },
    { key: 'alphaWalletsDetected', label: 'Alpha Wallets', sortable: true, tooltip: 'Number of high-profitability wallets actively being forged by the engine. Click Scan to discover more.' },
    { key: 'sourceOfTruth', label: 'Source of Truth', sortable: false, tooltip: 'The independent, on-chain data provider used to validate and rank top-performing wallets for this strategy.' },
    { key: 'avgPnlPerWallet', label: 'Avg PnL/Alpha Wallet', sortable: true, tooltip: 'Average Profit and Loss per actively forged alpha wallet.' },
    { key: 'totalPnl', label: 'Total PnL', sortable: true, tooltip: 'Total Profit and Loss generated by this strategy.' },
    { key: 'avgWinRate', label: 'Avg Win Rate', sortable: true, tooltip: 'The percentage of profitable trades versus all trades for this strategy.' },
    { key: 'forgingPrecision', label: 'Forging Precision', sortable: true, tooltip: "Orion's capability in perfectly forging and executing the trading logic of the forged wallet, expressed in %." },
    { key: 'enabled', label: 'Enabled', sortable: false, tooltip: 'Toggle to enable or disable the engine from executing this strategy.' },
  ];

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Tooltip text="Total profit generated by all active alpha strategies.">
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 shadow-lg">
                    <h3 className="text-base font-semibold text-white mb-2">Total Profit from Alpha Wallets</h3>
                    <p className="text-xl font-bold text-green-400">{formatCurrency(totals.totalPnl)}</p>
                </div>
            </Tooltip>
            <Tooltip text="The average success rate of the AI in accurately replicating and executing the trading patterns of detected alpha wallets.">
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 shadow-lg">
                    <h3 className="text-base font-semibold text-white mb-2">Avg. Forging Precision</h3>
                    <p className="text-xl font-bold text-cyan-400">{totals.avgForgingPrecision.toFixed(1)}%</p>
                </div>
            </Tooltip>
            <Tooltip text="Progress towards the user-defined daily profit goal.">
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 shadow-lg">
                    <ProgressBar value={totals.totalPnl} max={dailyProfitTarget} label="Daily Profit Target" />
                    <div className="text-xs text-gray-400 mt-2 text-right">
                        {formatCurrency(totals.totalPnl)} / {formatCurrency(dailyProfitTarget)}
                    </div>
                </div>
            </Tooltip>
        </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              {headers.map(header => (
                <th key={header.key} scope="col" className={`px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider transition-colors ${sortConfig.key === header.key ? 'bg-gray-700/50' : ''}`}>
                  <Tooltip text={header.tooltip}>
                      {header.sortable ? (
                        <button className="flex items-center space-x-2 group" onClick={() => requestSort(header.key as keyof Strategy)}>
                          <span>{header.label}</span>
                          {getSortIndicator(header.key as keyof Strategy)}
                        </button>
                      ) : (
                        <span className="px-2 py-1">{header.label}</span>
                      )}
                  </Tooltip>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-700">
            {sortedStrategies.map((strategy) => (
              <tr key={strategy.id} className="hover:bg-gray-800/50 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    <div className="flex items-center">
                        <span className={`h-2.5 w-2.5 rounded-full mr-3 flex-shrink-0 ${STRATEGY_COLORS[strategy.id]}`}></span>
                        <span>{strategy.name}</span>
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${strategy.status === 'Active' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                    {strategy.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <div className="flex items-center space-x-2">
                        <span>{strategy.alphaWalletsDetected}</span>
                        <Tooltip text={`Scan ${strategy.sourceOfTruth.name} for new alpha wallets`}>
                            <button onClick={() => handleScanForAlpha(strategy.id)} className="p-1 rounded-md hover:bg-cyan-500/20">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </button>
                        </Tooltip>
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <a href={strategy.sourceOfTruth.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline">
                        {strategy.sourceOfTruth.name}
                    </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatCurrency(strategy.avgPnlPerWallet)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400 font-semibold">{formatCurrency(strategy.totalPnl)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{strategy.avgWinRate.toFixed(1)}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-400 font-semibold">{strategy.forgingPrecision.toFixed(1)}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <ToggleSwitch enabled={strategy.enabled} onChange={() => handleToggle(strategy.id)} />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-800">
            <tr className="font-bold text-white">
                <td className="px-6 py-3 text-sm">Totals (Active)</td>
                <td className="px-6 py-3"></td>
                <td className="px-6 py-3 text-sm font-bold text-green-400">{totals.alphaWalletsDetected}</td>
                <td className="px-6 py-3"></td>
                <td className="px-6 py-3"></td>
                <td className="px-6 py-3 text-sm text-green-400">{formatCurrency(totals.totalPnl)}</td>
                <td className="px-6 py-3 text-sm">{totals.avgWinRate.toFixed(1)}%</td>
                <td className="px-6 py-3 text-sm text-cyan-400">{totals.avgForgingPrecision.toFixed(1)}%</td>
                <td className="px-6 py-3"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default Strategies;
