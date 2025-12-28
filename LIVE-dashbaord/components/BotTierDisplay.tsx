
import React from 'react';
import { BotTierStatus } from '../types';
// Fix: Added missing Zap import to resolve reference error on line 43
import { Eye, Shield, Activity, Workflow, Zap } from 'lucide-react';

interface Props {
  status: BotTierStatus;
}

export const BotTierDisplay: React.FC<Props> = ({ status }) => {
  return (
    <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2.5rem] space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Workflow className="w-4 h-4 text-emerald-500" />
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-300">Tri-Tier Bot Status</h3>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Scanners */}
        <div className="flex flex-col items-center gap-2 p-4 bg-slate-950/50 rounded-2xl border border-slate-800 relative group overflow-hidden">
          <Eye className="w-5 h-5 text-blue-400 animate-pulse" />
          <div className="text-center">
            <p className="text-[10px] text-slate-500 font-black uppercase">Scanners</p>
            <p className="text-xl font-bold text-white mono">{status.scanners}</p>
          </div>
          <div className="absolute top-0 right-0 p-1">
             <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
          </div>
        </div>

        {/* Captain */}
        <div className="flex flex-col items-center gap-2 p-4 bg-slate-950/50 rounded-2xl border border-emerald-500/30 relative group overflow-hidden">
          <Shield className="w-5 h-5 text-emerald-400" />
          <div className="text-center">
            <p className="text-[10px] text-slate-500 font-black uppercase">Captain</p>
            <p className="text-[10px] font-bold text-emerald-500 uppercase">{status.captain}</p>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500 animate-pulse"></div>
        </div>

        {/* Executors */}
        <div className="flex flex-col items-center gap-2 p-4 bg-slate-950/50 rounded-2xl border border-slate-800 relative group overflow-hidden">
          <Zap className="w-5 h-5 text-yellow-400" />
          <div className="text-center">
            <p className="text-[10px] text-slate-500 font-black uppercase">Executors</p>
            <p className="text-xl font-bold text-white mono">{status.executors}</p>
          </div>
          <div className="absolute top-0 right-0 p-1">
             <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3 bg-slate-800/30 rounded-xl border border-slate-800">
         <div className="flex items-center gap-2">
           <Activity className="w-3.5 h-3.5 text-slate-500" />
           <span className="text-[9px] text-slate-400 font-bold uppercase">Avg Task Execution</span>
         </div>
         <span className="text-xs font-bold text-white mono">{status.avgTaskTime}ms</span>
      </div>
    </div>
  );
};
