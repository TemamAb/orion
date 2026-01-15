
import React, { useState, useEffect, useRef } from 'react';
import { LogEntry } from '../types';

const LOG_TYPE_COLORS: Record<LogEntry['type'], string> = {
  SCAN: 'text-blue-400',
  ORCHESTRATE: 'text-purple-400',
  EXECUTE: 'text-yellow-400',
  SUCCESS: 'text-green-400',
  FAIL: 'text-red-400',
  INFO: 'text-gray-500',
};

const generateRandomLog = (): LogEntry => {
    const types: LogEntry['type'][] = ['SCAN', 'ORCHESTRATE', 'EXECUTE', 'SUCCESS', 'FAIL', 'INFO'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    let message = '';
    let data = {};

    switch (randomType) {
        case 'SCAN':
            message = 'Detected potential arbitrage opportunity.';
            data = { pair: 'WETH/USDC', disparity: `${(Math.random() * 0.5 + 0.3).toFixed(3)}%`, dex: 'Uniswap v3' };
            break;
        case 'ORCHESTRATE':
            message = 'Vertex AI validated strategy. Forging execution plan.';
            data = { strategy: 'Cross-DEX Arbitrage', roi_estimate: `${(Math.random() * 2 + 0.5).toFixed(2)}%`, liquidity_check: 'OK' };
            break;
        case 'EXECUTE':
            message = 'Submitting atomic transaction bundle to Pimlico bundler.';
            data = { flash_loan: 'Aave v3', amount: `${Math.floor(Math.random() * 50 + 10)} ETH`, gas_sponsored: 'true' };
            break;
        case 'SUCCESS':
            message = 'Trade executed successfully. Profit secured.';
            data = { profit: `$${(Math.random() * 500 + 50).toFixed(2)}`, txHash: `0x${[...Array(8)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}...` };
            break;
        case 'FAIL':
            message = 'Transaction reverted. MEV protection triggered.';
            data = { reason: 'Slippage too high', txHash: `0x${[...Array(8)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}...` };
            break;
        case 'INFO':
            message = 'System heartbeat check nominal.';
            data = { active_scanners: 5, orchestrator_latency: `${Math.floor(Math.random() * 20 + 40)}ms` };
            break;
    }

    return {
        timestamp: new Date().toISOString(),
        type: randomType,
        message,
        data,
    };
};

const Logs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setLogs(prevLogs => [generateRandomLog(), ...prevLogs.slice(0, 199)]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div className="flex flex-col h-[80vh] bg-gray-900/80 border border-gray-700 rounded-lg shadow-2xl shadow-cyan-500/10">
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <div>
            <h2 className="text-xl font-semibold text-white">Real-Time Event Logs</h2>
            <p className="text-sm text-gray-400">Live feed of all trade events executed on-chain</p>
        </div>
        <button 
            onClick={() => setIsPaused(!isPaused)}
            className={`px-4 py-2 rounded-md font-semibold text-white transition-colors ${isPaused ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
        >
            {isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>
      <div ref={logContainerRef} className="flex-grow p-4 overflow-y-auto font-mono text-xs bg-black/30">
        {logs.map((log, index) => (
          <div key={index} className="flex gap-4 items-start mb-2 animate-fade-in">
            <span className="text-gray-600">{new Date(log.timestamp).toLocaleTimeString()}</span>
            <span className={`font-bold w-28 flex-shrink-0 ${LOG_TYPE_COLORS[log.type]}`}>[{log.type}]</span>
            <div className="flex-grow">
                <p className="text-gray-300">{log.message}</p>
                <p className="text-gray-500">{JSON.stringify(log.data)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Logs;
