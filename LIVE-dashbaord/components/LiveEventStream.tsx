
import React, { useEffect, useRef } from 'react';
import { BlockchainEvent } from '../types';
import { Terminal, Radio } from 'lucide-react';

interface Props {
  events: BlockchainEvent[];
}

export const LiveEventStream: React.FC<Props> = ({ events }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0; // Keep newest at top
    }
  }, [events]);

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'success': return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
      case 'danger': return 'text-red-400 border-red-500/20 bg-red-500/5';
      case 'warning': return 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5';
      default: return 'text-blue-400 border-blue-500/20 bg-blue-500/5';
    }
  };

  return (
    <div className="bg-black/60 border border-slate-800 rounded-[2.5rem] overflow-hidden flex flex-col h-[400px] shadow-2xl relative group">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 pointer-events-none z-10"></div>
      
      {/* Stream Header */}
      <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Terminal className="w-4 h-4 text-emerald-500" />
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-300">Blockchain Event Stream</h3>
        </div>
        <div className="flex items-center gap-2">
          <Radio className="w-3 h-3 text-red-500 animate-pulse" />
          <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Live Node Feed</span>
        </div>
      </div>

      {/* Events Feed */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide flex flex-col-reverse"
      >
        {events.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-20">
            <Radio className="w-12 h-12 mb-4 animate-ping" />
            <span className="text-[10px] font-bold uppercase tracking-[0.5em]">Establishing Connection...</span>
          </div>
        )}
        
        {events.map((event) => (
          <div 
            key={event.id} 
            className={`p-3 rounded-xl border text-[10px] font-mono transition-all duration-500 animate-in fade-in slide-in-from-top-2 ${getSeverityStyles(event.severity)}`}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="font-black tracking-tighter">[{event.type}]</span>
              <span className="opacity-50">
                {new Date(event.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
            <p className="leading-relaxed opacity-90">{event.message}</p>
          </div>
        ))}
      </div>

      {/* Footer / Status */}
      <div className="p-3 bg-slate-900/80 border-t border-slate-800 flex justify-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span className="text-[8px] text-slate-500 font-bold uppercase">Websocket Ready</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            <span className="text-[8px] text-slate-500 font-bold uppercase">RPC-1 Primary</span>
          </div>
        </div>
      </div>
    </div>
  );
};
