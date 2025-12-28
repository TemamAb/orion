
import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  label: string;
  status: boolean;
}

export const SystemHealthStatus: React.FC<Props> = ({ label, status }) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 p-2 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all hover:bg-slate-800/80">
      <span className="text-[8px] text-slate-400 font-black uppercase tracking-tighter text-center">{label}</span>
      {status ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      ) : (
        <XCircle className="w-4 h-4 text-red-500 animate-pulse" />
      )}
      <span className={`text-[8px] font-bold ${status ? 'text-emerald-500' : 'text-red-500'}`}>
        {status ? 'ONLINE' : 'OFFLINE'}
      </span>
    </div>
  );
};
