
import React from 'react';
import { GcpIcon } from '../components/icons/GcpIcon';
import Tooltip from '../components/Tooltip';

const FlowNode: React.FC<{ title: string; description: string; icon: React.ReactNode; tooltipText: string; isGcp?: boolean; isInfra?: boolean; }> = ({ title, description, icon, tooltipText, isGcp, isInfra }) => (
    <Tooltip text={tooltipText}>
        <div className={`bg-gray-900/70 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-3 flex flex-col items-center justify-center text-center shadow-2xl shadow-cyan-900/30 hover:border-cyan-500/70 transition-colors duration-300 flex-shrink-0 z-10 ${isInfra ? 'w-full h-36' : 'w-56 h-36'}`}>
            <div className="text-cyan-400 mb-2">{icon}</div>
            <h3 className={`font-semibold text-white ${isInfra ? 'text-sm' : 'text-base'}`}>{title}</h3>
            <p className="text-[11px] text-gray-400 mt-1 leading-tight">{description}</p>
            {isGcp && <GcpIcon className="h-4 w-4 mt-2 text-blue-400" />}
        </div>
    </Tooltip>
);

const AnimatedConnector: React.FC<{ color: 'cyan' | 'green' }> = ({ color }) => {
    const gradientId = `dot-gradient-${color}`;
    const stopColor = color === 'cyan' ? '#06b6d4' : '#10b981';
    const stopColorLight = color === 'cyan' ? '#67e8f9' : '#34d399';

    return (
        <div className="relative flex-1 h-full flex items-center justify-center">
            <svg width="100%" height="10" className="absolute overflow-visible">
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <radialGradient id={gradientId}>
                        <stop offset="0%" stopColor={stopColorLight} />
                        <stop offset="50%" stopColor={stopColor} />
                        <stop offset="100%" stopColor={stopColor} stopOpacity="0" />
                    </radialGradient>
                </defs>
                <line x1="0" y1="5" x2="100%" y2="5" stroke="#1e293b" strokeWidth="1" />
                <path d="M0 5 H 2000" id={`h-path-flow-${color}`} stroke="none" />
                
                {[0, 0.6, 1.2, 1.8, 2.4].map(delay => (
                     <circle key={delay} r="4" fill={`url(#${gradientId})`} filter="url(#glow)">
                        <animateMotion dur="3s" begin={`${delay}s`} repeatCount="indefinite">
                            <mpath href={`#h-path-flow-${color}`} />
                        </animateMotion>
                    </circle>
                ))}
            </svg>
        </div>
    );
};

const EngineSystem: React.FC = () => {
  const detectionNodes = [
    { title: 'User Authority', description: 'Authorizes engine & receives profits.', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>, tooltipText: "The user's primary wallet, which provides the authorization signature for engine operations and serves as the final destination for withdrawn profits." },
    { title: 'Alpha Strategy Detection', description: 'Scans for 7 core alpha patterns.', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>, isGcp: true, tooltipText: "Scanner bots on Cloud Run continuously monitor mempool and on-chain data to identify transactions matching one of the seven pre-defined, high-profitability arbitrage strategies." },
    { title: 'Alpha Wallet Forging', description: 'Forges patterns of top wallets.', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>, tooltipText: "Once a strategy is detected, the system identifies the specific 'alpha wallets' executing it successfully. Vertex AI then forges a precise execution model based on these wallets' transaction patterns." },
  ];

  const executionNodes = [
    { title: 'Orchestrator & Executor', description: 'Constructs & submits atomic TX.', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>, isGcp: true, tooltipText: "The Orchestrator validates the forged strategy's ROI. If profitable, the Executor bot constructs an atomic bundle of transactions (flash loan, swaps, repayment) for execution." },
    { title: 'Flash Loan & Swaps', description: 'Gasless, atomic execution.', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>, tooltipText: "The transaction bundle is submitted to a private mempool (e.g., Flashbots) to execute the flash loan and all required swaps atomically, preventing front-running and ensuring gasless execution via Pimlico paymasters." },
    { title: 'Profit Settlement', description: 'Sweeps profit to treasury.', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>, tooltipText: "Upon successful execution, the arbitrage profit is automatically swept to the designated treasury wallet, ready for withdrawal." },
  ];

  const infraNodes = [
    { title: 'Vertex AI', description: 'Gemini Strategy Forging', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M4 17v4m-2-2h4m1-15l2.293 2.293a1 1 0 010 1.414L5 21m14-16l-2.293 2.293a1 1 0 000 1.414L19 21" /></svg>, isGcp: true, tooltipText: "Google's Vertex AI platform, running Gemini models, serves as the core intelligence for forging and validating arbitrage strategies." },
    { title: 'Cloud Run', description: 'Serverless Bot Compute', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>, isGcp: true, tooltipText: "All bots (Scanner, Orchestrator, Executor) are deployed as scalable, serverless services on Google Cloud Run for high availability and low latency." },
    { title: 'Pub/Sub', description: 'Async Messaging', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>, isGcp: true, tooltipText: "Google Pub/Sub provides the asynchronous messaging backbone that decouples the bots, ensuring system resilience and scalability." },
    { title: 'Cloud SQL', description: 'Transactional DB', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>, isGcp: true, tooltipText: "A managed PostgreSQL database on Google Cloud SQL for storing critical operational data like executed trades and audit trails." },
    { title: 'Memorystore', description: 'High-Speed Cache', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>, isGcp: true, tooltipText: "Google Memorystore for Redis provides an ultra-low latency cache for real-time market data and intermediate strategy states." },
    { title: 'BigQuery', description: 'Analytics Warehouse', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>, isGcp: true, tooltipText: "Google BigQuery serves as the central data warehouse for all historical data, enabling deep analytics and performance monitoring." },
  ];

  return (
    <div className="space-y-12">
      <section className="flex flex-col items-center space-y-8">
        <h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-cyan-400 pl-4 self-start">Trade Execution Flow</h2>
        
        <div className="w-full p-8 rounded-xl blockchain-bg border border-cyan-500/20">
            <div className="flex flex-col items-center space-y-8">
                {/* Detection Row */}
                <div className="flex items-center justify-between w-full">
                    <FlowNode {...detectionNodes[0]} />
                    <AnimatedConnector color="cyan" />
                    <FlowNode {...detectionNodes[1]} />
                    <AnimatedConnector color="cyan" />
                    <FlowNode {...detectionNodes[2]} />
                </div>

                {/* Execution Row */}
                <div className="flex items-center justify-between w-full">
                    <FlowNode {...executionNodes[0]} />
                    <AnimatedConnector color="green" />
                    <FlowNode {...executionNodes[1]} />
                    <AnimatedConnector color="green" />
                    <FlowNode {...executionNodes[2]} />
                </div>
            </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-cyan-400 pl-4">Data & Infrastructure</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {infraNodes.map(node => (
            <FlowNode key={node.title} {...node} isInfra={true} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default EngineSystem;
