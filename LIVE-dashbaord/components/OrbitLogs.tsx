
import React from 'react';
import { Position } from '../types';
import { TrendingUp, TrendingDown, CheckCircle2, ArrowUpRight } from 'lucide-react';

interface Props {
  positions: Position[];
}

export const OrbitLogs: React.FC<Props> = ({ positions }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {positions.map((pos) => (
        <div key={pos.id} className="flex items-center justify-between p-4 bg-slate-900/40 border border-slate-800 rounded-3xl hover:bg-slate-800/60 hover:border-slate-700 transition-all group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${pos.status === 'withdrawn' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
              {pos.status === 'withdrawn' ? <ArrowUpRight className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-100 uppercase tracking-tighter">{pos.symbol}</span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1 mt-0.5">
                {pos.status === 'withdrawn' ? (
                  <span className="flex items-center gap-1 text-emerald-500/80">
                    <CheckCircle2 className="w-2.5 h-2.5" /> 
                    {pos.recipient ? `TO: ${pos.recipient}` : 'SETTLED'}
                  </span>
                ) : (
                  'Awaiting Consesnus'
                )}
              </span>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <span className={`text-lg font-mono font-black ${pos.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {pos.profit >= 0 ? '+' : ''}${Math.abs(pos.profit).toFixed(2)}
            </span>
            <span className="text-[8px] text-slate-600 font-mono uppercase">
               {new Date(pos.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
