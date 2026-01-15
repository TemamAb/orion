
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import MetricCard from '../components/MetricCard';
import { ProfitDataPoint } from '../types';
import { useInterval } from '../hooks/useInterval';
import Tooltip from '../components/Tooltip';

interface ProfitAnalyticsProps {
  currency: 'ETH' | 'USD';
  refreshInterval: number;
}

const generateDataPoint = (lastProfit: number): number => {
    const change = (Math.random() - 0.48) * (lastProfit * 0.001);
    return Math.max(0, lastProfit + change);
};

const initialData: ProfitDataPoint[] = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setSeconds(date.getSeconds() - (30 - i) * 5);
    return {
        time: date.toLocaleTimeString(),
        profit: 1000 + i * 10 + (Math.random() - 0.5) * 50,
    };
});

const ProfitAnalytics: React.FC<ProfitAnalyticsProps> = ({ currency, refreshInterval }) => {
  const [data, setData] = useState<ProfitDataPoint[]>(initialData);

  useInterval(() => {
    setData(prevData => {
      const lastPoint = prevData[prevData.length - 1];
      const newPoint: ProfitDataPoint = {
        time: new Date().toLocaleTimeString(),
        profit: generateDataPoint(lastPoint.profit),
      };
      const newData = [...prevData, newPoint];
      if (newData.length > 60) {
        return newData.slice(newData.length - 60);
      }
      return newData;
    });
  }, refreshInterval);

  const formatCurrency = (value: number) => {
    return currency === 'USD'
      ? `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : `Ξ${value.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`;
  };

  const lastProfit = data.length > 0 ? data[data.length - 1].profit : 0;
  const profitPerHour = lastProfit * 12; // Assuming 5s interval
  const profitPerDay = profitPerHour * 24;
  const profitPerTrade = lastProfit * 0.015; // Mock value
  const tradesPerHour = 3600 / (refreshInterval / 1000) / 15; // Mock value

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="Profit/Hour" value={formatCurrency(profitPerHour)} colorClass="bg-green-500/20" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} tooltipText="Estimated profit generated over the last hour based on current performance." />
        <MetricCard label="Profit/Day" value={formatCurrency(profitPerDay)} colorClass="bg-blue-500/20" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} tooltipText="Projected 24-hour profit based on the current hourly rate." />
        <MetricCard label="Profit/Trade" value={formatCurrency(profitPerTrade)} colorClass="bg-yellow-500/20" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} tooltipText="The average profit generated from each successfully executed arbitrage trade." />
        <MetricCard label="Trades/Hour" value={tradesPerHour.toFixed(1)} colorClass="bg-purple-500/20" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} tooltipText="The number of trades the engine is executing per hour." />
      </div>
      <Tooltip text="This chart displays the real-time cumulative profit over the last several minutes, updated at the selected refresh interval.">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 shadow-lg h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
              <defs>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} />
              <YAxis 
                stroke="#9ca3af" 
                fontSize={12} 
                tickFormatter={(value) => formatCurrency(value as number)}
                domain={['dataMin - 100', 'dataMax + 100']}
                allowDataOverflow={true}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: 'rgba(31, 41, 55, 0.8)',
                  borderColor: '#4b5563',
                  color: '#d1d5db'
                }}
                labelStyle={{ color: '#ffffff' }}
                formatter={(value) => [formatCurrency(value as number), 'Profit']}
              />
              <Area type="monotone" dataKey="profit" stroke="#06b6d4" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Tooltip>
    </div>
  );
};

export default ProfitAnalytics;
