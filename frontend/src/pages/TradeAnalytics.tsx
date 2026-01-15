
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import MetricCard from '../components/MetricCard';
import { FlashLoanProviderData } from '../types';
import Tooltip from '../components/Tooltip';

const flashLoanData: FlashLoanProviderData[] = [
  { name: 'Aave v3', value: 45000000, fill: '#2dd4bf' },
  { name: 'Uniswap v3', value: 30000000, fill: '#60a5fa' },
  { name: 'Balancer', value: 15000000, fill: '#c084fc' },
  { name: 'Other', value: 5000000, fill: '#f87171' },
];

const STRATEGY_DATA_SEED = [
  { id: 's1', name: 'Cross-DEX', color: '#22d3ee' },
  { id: 's2', name: 'Triangular', color: '#38bdf8' },
  { id: 's3', name: 'Liquidation', color: '#f87171' },
  { id: 's4', name: 'MEV', color: '#9ca3af' },
  { id: 's5', name: 'Flash Mint', color: '#a78bfa' },
  { id: 's6', name: 'Yield Farm', color: '#a3a3a3' },
  { id: 's7', name: 'NFT Floor', color: '#facc15' },
];

const TIME_MULTIPLIERS = {
    Hour: 1,
    Day: 24,
    Week: 24 * 7,
    Month: 24 * 30,
    Year: 24 * 365,
};

type TimeFilter = keyof typeof TIME_MULTIPLIERS;

const generateStrategyData = (filter: TimeFilter) => {
    const multiplier = TIME_MULTIPLIERS[filter];
    return STRATEGY_DATA_SEED.map(strategy => ({
        ...strategy,
        profit: Math.floor((Math.random() * 500 + 50) * multiplier * (strategy.name === 'MEV' || strategy.name === 'Yield Farm' ? 0.2 : 1)),
    }));
};


const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-gray-700 border border-gray-600 rounded-md shadow-lg">
        <p className="label text-white">{`${payload[0].name} : $${payload[0].value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

const TradeAnalytics: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('Day');
  const [strategyData, setStrategyData] = useState(generateStrategyData(timeFilter));

  useEffect(() => {
    setStrategyData(generateStrategyData(timeFilter));
  }, [timeFilter]);

  return (
    <div className="space-y-12">
      {/* Latency Row */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-cyan-400 pl-4">Execution Latency</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard label="Scanner Bots" value="15 ms" colorClass="bg-blue-500/20" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} tooltipText="Average time for scanner bots to detect a potential opportunity from the mempool." />
          <MetricCard label="Orchestrator" value="45 ms" colorClass="bg-purple-500/20" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3" /></svg>} tooltipText="Average time for the orchestrator to validate the strategy with Vertex AI and prepare the transaction." />
          <MetricCard label="Executors" value="80 ms" colorClass="bg-yellow-500/20" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>} tooltipText="Average time for executor bots to get the transaction bundle included in a block." />
          <MetricCard label="Total E2E" value="140 ms" colorClass="bg-green-500/20" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} tooltipText="Total average end-to-end latency from detection to execution confirmation." />
        </div>
      </section>

      {/* Security Row */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-cyan-400 pl-4">Security & MEV Protection</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard label="MEV Attacks Prevented" value="99.8%" colorClass="bg-red-500/20" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>} tooltipText="Percentage of identified MEV threats (e.g., sandwich attacks) successfully mitigated by using private relays." />
          <MetricCard label="Front-running Avoided" value="99.9%" colorClass="bg-orange-500/20" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-1-5h2v2h-2zm0-8h2v6h-2z" /></svg>} tooltipText="Percentage of trades where potential front-running was detected and avoided." />
          <MetricCard label="Stealth Transactions" value="75.2%" colorClass="bg-indigo-500/20" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>} tooltipText="Percentage of withdrawals utilizing intermediate wallets for enhanced privacy." />
          <MetricCard label="Threats Mitigated (24h)" value="1,284" colorClass="bg-pink-500/20" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} tooltipText="Total number of malicious transaction patterns identified and blocked in the last 24 hours." />
        </div>
      </section>

      {/* Flash Loan Row */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-cyan-400 pl-4">Flash Loan Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <MetricCard label="Total Loan Volume (24h)" value="$95M" colorClass="bg-teal-500/20" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>} tooltipText="Total USD value of all flash loans initiated by the engine in the last 24 hours." />
          <MetricCard label="Loan Utilization Rate" value="92.8%" colorClass="bg-cyan-500/20" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10H5.236a2 2 0 00-1.789 2.894l3.5 7a2 2 0 001.789 1.106h4.012a2 2 0 001.789-1.106l3.5-7A2 2 0 0018.764 10H14z" /></svg>} tooltipText="Percentage of available capital from flash loan providers that is currently being utilized by the engine." />
          <MetricCard label="Active Providers" value="3" colorClass="bg-sky-500/20" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" /></svg>} tooltipText="Number of unique flash loan providers (e.g., Aave, Uniswap) currently integrated and active." />
          <Tooltip text="Breakdown of flash loan volume by provider. Shows which liquidity sources are most heavily utilized.">
            <div className="md:col-span-3 lg:col-span-2 bg-gray-800/50 border border-gray-700 rounded-lg p-4 shadow-lg flex flex-col items-center">
              <h3 className="text-lg font-semibold text-white mb-2">Provider Loan Share</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={flashLoanData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                  >
                    {flashLoanData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Tooltip>
        </div>
      </section>

      {/* Strategy Analysis */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-cyan-400 pl-4">Strategy Profit Contribution</h2>
        <Tooltip text="This chart shows the total profit contributed by each alpha strategy over the selected time period. Use the filters to analyze performance from the last hour to the last year.">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 shadow-lg">
                <div className="flex justify-end mb-4">
                    <div className="flex space-x-1 bg-gray-900/50 p-1 rounded-md">
                        {(Object.keys(TIME_MULTIPLIERS) as TimeFilter[]).map(interval => (
                            <button key={interval} onClick={() => setTimeFilter(interval)} className={`px-3 py-1 text-xs rounded ${timeFilter === interval ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>{interval}</button>
                        ))}
                    </div>
                </div>
                <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={strategyData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                            <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(value) => `$${Number(value).toLocaleString()}`} />
                            <RechartsTooltip
                                cursor={{fill: 'rgba(100, 116, 139, 0.1)'}}
                                contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }}
                                labelStyle={{ color: '#ffffff' }}
                            />
                            <Bar dataKey="profit">
                                {strategyData.map((entry) => (
                                    <Cell key={`cell-${entry.id}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Tooltip>
      </section>

      {/* System Capacity & Precision Row */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-cyan-400 pl-4">System Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MetricCard label="System Capacity" value="85.3%" colorClass="bg-lime-500/20" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-lime-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} tooltipText="Current utilization of allocated compute and network resources across all bots." />
          <MetricCard label="Pattern Forging Precision" value="98.7%" colorClass="bg-fuchsia-500/20" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M4 17v4m-2-2h4m1-15l2.293 2.293a1 1 0 010 1.414L5 21m14-16l-2.293 2.293a1 1 0 000 1.414L19 21" /></svg>} tooltipText="The AI's success rate in accurately replicating the trading patterns of detected alpha wallets." />
        </div>
      </section>
    </div>
  );
};

export default TradeAnalytics;
