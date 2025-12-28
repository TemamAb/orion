
import React from 'react';

interface DataPoint {
  name: string;
  percent: number;
  profit: number;
}

interface Props {
  title: string;
  data: DataPoint[];
  icon: React.ReactNode;
}

export const AnalyticsBreakdown: React.FC<Props> = ({ title, data, icon }) => {
  return (
    <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2.5rem] space-y-4 hover:border-slate-700 transition-all">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-300">{title} Profit Share</h3>
      </div>
      <div className="space-y-4">
        {data.map((item, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex justify-between items-end">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{item.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-emerald-400 font-black mono">${item.profit.toLocaleString()}</span>
                <span className="text-[9px] text-slate-600 font-bold">{item.percent}%</span>
              </div>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full transition-all duration-1000" 
                style={{ width: `${item.percent}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
