
import React from 'react';

interface Props {
  label: string;
  value: string | number;
  subValue: string;
  icon: React.ReactNode;
}

export const MetricCard: React.FC<Props> = ({ label, value, subValue, icon }) => {
  return (
    <div className="bg-slate-900/40 border border-slate-800 p-3 rounded-2xl hover:border-emerald-500/50 transition-all group overflow-hidden relative">
      <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
        {icon}
      </div>
      <div className="flex flex-col gap-1 relative z-10">
        <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider">{label}</span>
        <span className="text-xl font-bold text-white tracking-tighter mono">{value}</span>
        <span className="text-[9px] text-emerald-400 font-bold">{subValue}</span>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-slate-700/50 to-transparent"></div>
    </div>
  );
};
