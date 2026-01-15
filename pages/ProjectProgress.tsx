
import React, { useMemo } from 'react';
import { ProjectMilestone } from '../types';
import ProgressBar from '../components/ProgressBar';

const milestones: ProjectMilestone[] = [
  { id: 1, phase: 'Phase 1: System Architecture & Design', milestone: 'System Blueprint Design', gcpServices: ['Cloud Run', 'Pub/Sub', 'Vertex AI'], externalFeatures: ['ERC-4337', 'Pimlico', 'Flashbots'], status: 'Completed', details: '- Defined Tri-Tier Bot Architecture (Scanner, Orchestrator, Executor).\n- Mapped serverless, event-driven data flow for scalability and resilience.\n- Selected core blockchain protocols for gasless, MEV-protected execution.', timeHours: 8 },
  { id: 2, phase: 'Phase 1: System Architecture & Design', milestone: 'Data & AI Infrastructure', gcpServices: ['Cloud SQL', 'Memorystore', 'BigQuery', 'Vertex AI (Gemini)'], externalFeatures: [], status: 'Completed', details: '- Architected data layers for transactional (PostgreSQL), cache (Redis), and analytical (DWH) needs.\n- Designed schema for strategy forging, performance analysis, and operational auditing.', timeHours: 6 },
  { id: 3, phase: 'Phase 2: Backend Development', milestone: 'Scanner Bot Implementation', gcpServices: ['Cloud Run', 'Pub/Sub API'], externalFeatures: ['Blockchain Node RPC (e.g., Infura, Alchemy)'], status: 'Completed', details: '- Architected and generated Go source code for the Scanner service.\n- Created Dockerfile for containerization and deployment to Cloud Run.', timeHours: 20 },
  { id: 4, phase: 'Phase 2: Backend Development', milestone: 'Orchestrator Bot Implementation', gcpServices: ['Cloud Run', 'Vertex AI API', 'Memorystore API', 'Secret Manager API'], externalFeatures: ['Pimlico Paymaster API'], status: 'Completed', details: '- Architected and generated Python source code for the Orchestrator service.\n- Integrated Flask for Pub/Sub push subscriptions and prepared for Gemini integration.', timeHours: 25 },
  { id: 5, phase: 'Phase 2: Backend Development', milestone: 'Executor Bot Implementation', gcpServices: ['Cloud Run', 'Secret Manager API'], externalFeatures: ['Flashbots RPC', 'Aave/Uniswap Protocols'], status: 'Completed', details: '- Architected and generated Node.js/TypeScript source code for the Executor service.\n- Implemented secure secret fetching logic for API keys and private keys.', timeHours: 30 },
  { id: 6, phase: 'Phase 3: Frontend UI/UX', milestone: 'Dashboard Implementation', gcpServices: [], externalFeatures: ['React', 'TypeScript', 'Tailwind CSS', 'Vertex AI Studio'], status: 'Completed', details: '- Built all pages, components, and navigation in this session.\n- Implemented real-time charts, animated workflows, and a consistent, professional UI/UX.\n- Engineered a robust, portal-based tooltip system for all interactive elements.', timeHours: 12 },
  { id: 7, phase: 'Phase 4: Deployment & Ops', milestone: 'Infrastructure as Code (IaC)', gcpServices: ['Terraform', 'Cloud Build', 'Artifact Registry', 'IAM'], externalFeatures: [], status: 'Completed', details: '- Generated Terraform scripts to provision all necessary GCP resources.\n- Defined service accounts, IAM roles, Pub/Sub topics, and Cloud Run services.\n- Created deployment scripts for building and pushing container images.', timeHours: 16 },
  { id: 8, phase: 'Phase 4: Deployment & Ops', milestone: 'Live Monitoring & Alerting', gcpServices: ['Cloud Monitoring', 'Cloud Logging', 'Alerting Policies'], externalFeatures: [], status: 'Completed', details: '- Defined a Cloud Monitoring dashboard and a critical error rate alert using Terraform.\n- This provides observability into the health and performance of the live system.', timeHours: 10 },
  { id: 9, phase: 'Phase 5: Live Simulation & Paper Trading', milestone: 'Live Data Integration', gcpServices: ['Cloud Run'], externalFeatures: ['Alchemy/Infura WebSockets'], status: 'Pending', details: '- Connect the Go Scanner Bot to a live WebSocket stream from a node provider to process real-time mempool data instead of simulated blocks.', timeHours: 12 },
  { id: 10, phase: 'Phase 5: Live Simulation & Paper Trading', milestone: 'Paper Trading Mode', gcpServices: ['Cloud Run', 'Cloud SQL'], externalFeatures: [], status: 'Pending', details: "- Implement a 'paper trading' flag in the Executor Bot. When enabled, instead of submitting transactions to Flashbots, it will log the intended trade and its simulated outcome to the PostgreSQL database.", timeHours: 18 },
  { id: 11, phase: 'Phase 5: Live Simulation & Paper Trading', milestone: 'Mainnet Fork Simulation', gcpServices: [], externalFeatures: ['Hardhat/Foundry', 'Mainnet RPC Fork'], status: 'Pending', details: '- Set up a local testing environment that forks the live mainnet state. Run the entire bot pipeline against this fork to test transaction execution with realistic on-chain conditions.', timeHours: 24 },
  { id: 12, phase: 'Phase 5: Live Simulation & Paper Trading', milestone: 'Performance & Profitability Analysis', gcpServices: ['BigQuery'], externalFeatures: [], status: 'Pending', details: "- After running simulations, use BigQuery to analyze the paper trading results. Validate strategy profitability, win rates, and overall system performance before risking real capital.", timeHours: 10 },
];

const phaseIntroductions: Record<string, string> = {
    'Phase 1: System Architecture & Design': "This foundational phase is about creating the master blueprint for the entire Orion application. The goal is to design a highly scalable, resilient, and secure system by leveraging a 'Google Cloud first' philosophy. We define the core components, their interactions, and the data flow, ensuring every subsequent development phase is built upon a solid, enterprise-grade architectural foundation.",
    'Phase 2: Backend Development': "This phase involves the implementation of the core engine logic. Each bot in the Tri-Tier architecture is developed as an independent microservice on Google Cloud Run. The focus is on performance, low latency, and secure integration with both GCP services and external blockchain protocols. This is where the theoretical architecture becomes a functional, automated trading system.",
    'Phase 3: Frontend UI/UX': "This phase, completed in this session, focuses on building the human-computer interface for the Orion engine. The goal is to create an institutional-grade dashboard that provides clear, real-time insights into the system's operations, performance, and profitability. It serves as the command and control center for monitoring and managing the live application.",
    'Phase 4: Deployment & Ops': "This phase bridges the gap between development and live production. We establish automated pipelines for deploying the backend services and set up comprehensive monitoring and alerting. The goal is to ensure the system can be deployed reliably and that its operational health can be observed and managed in real-time, 24/7.",
    'Phase 5: Live Simulation & Paper Trading': "This is the final and most critical validation phase before deploying with real capital. The goal is to run the complete Orion engine against live, real-time market data in a simulated environment ('paper trading'). This allows us to rigorously test our strategies, validate profitability, and measure performance under real-world conditions without any financial risk.",
};

const STATUS_COLORS = { 'Completed': 'bg-green-900 text-green-300', 'In Progress': 'bg-yellow-900 text-yellow-300', 'Pending': 'bg-gray-700 text-gray-400' };
const CheckIcon: React.FC = () => <svg className="h-4 w-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;

const PhaseSection: React.FC<{ phaseGroup: any; index: number }> = ({ phaseGroup, index }) => {
    const [isOpen, setIsOpen] = useState(true); // Keep all phases open by default
    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full p-4 bg-gray-800 hover:bg-gray-700/50 transition-colors flex justify-between items-center">
                <div className="flex items-center space-x-4 text-left">
                    <span className="font-bold text-xl text-cyan-400">{index + 1}</span>
                    <span className="font-bold text-white text-lg">{phaseGroup.phaseName}</span>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="w-48 hidden md:block"><ProgressBar value={phaseGroup.progress} max={100} label={`Phase Progress`} /></div>
                    <span className="text-sm text-gray-400 hidden md:block">{phaseGroup.totalHours} Hours</span>
                    <svg className={`h-6 w-6 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
            </button>
            {isOpen && (
                <div className="p-6 space-y-4 border-t border-gray-700">
                    <p className="text-sm text-gray-300 mb-4 italic">{phaseIntroductions[phaseGroup.phaseName]}</p>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="border-b border-gray-700">
                                <tr>
                                    <th className="py-2 pr-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-1/4">Milestone</th>
                                    <th className="py-2 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-1/4">Google Cloud Provider</th>
                                    <th className="py-2 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-1/4">External Providers / APIs</th>
                                    <th className="py-2 pl-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-1/2">Key Activities</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {phaseGroup.milestones.map((item: ProjectMilestone) => (
                                    <tr key={item.id}>
                                        <td className="py-3 pr-4 align-top">
                                            <div className="flex items-center space-x-2">
                                                <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUS_COLORS[item.status]}`}>{item.status}</span>
                                                <span className="text-sm text-white">{item.milestone}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-300 font-mono align-top">
                                            {item.gcpServices.length > 0 ? item.gcpServices.map(s => <div key={s} className="flex items-center space-x-2"><CheckIcon /><span>{s}</span></div>) : <span className="text-gray-500">-</span>}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-300 font-mono align-top">
                                            {item.externalFeatures.length > 0 ? item.externalFeatures.map(f => <div key={f} className="flex items-center space-x-2"><span className="text-cyan-400">&bull;</span><span>{f}</span></div>) : <span className="text-gray-500">-</span>}
                                        </td>
                                        <td className="py-3 pl-4 text-sm text-gray-400 max-w-md align-top whitespace-pre-line">{item.details}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

const ProjectProgress: React.FC = () => {
    const groupedPhases = useMemo(() => {
        const phases = milestones.reduce((acc, milestone) => {
            (acc[milestone.phase] = acc[milestone.phase] || []).push(milestone);
            return acc;
        }, {} as Record<string, ProjectMilestone[]>);

        return Object.entries(phases).map(([phaseName, milestonesInPhase]) => {
            const completedCount = milestonesInPhase.filter(m => m.status === 'Completed').length;
            const totalCount = milestonesInPhase.length;
            const progress = (completedCount / totalCount) * 100;
            const totalHours = milestonesInPhase.reduce((sum, m) => sum + m.timeHours, 0);
            return { phaseName, milestones: milestonesInPhase, progress, totalHours };
        });
    }, []);

    const overallProgress = useMemo(() => {
        const completedCount = milestones.filter(m => m.status === 'Completed').length;
        return (completedCount / milestones.length) * 100;
    }, []);

    return (
        <div className="space-y-8">
            <section>
                <h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-cyan-400 pl-4">Project Progress Audit</h2>
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-white">A Developer's Guide to Building Orion</h3>
                    <p className="text-sm text-gray-400 mt-2 mb-4">This document outlines the professional, five-phase methodology required to build, deploy, and monitor the Orion enterprise-grade arbitrage application. Each phase is a critical component of the whole, designed to ensure a robust, scalable, and profitable system. Follow this guide systematically to execute the project plan.</p>
                    <ProgressBar value={overallProgress} max={100} label="Overall Project Completion" />
                </div>
            </section>

            <div className="space-y-4">
                {groupedPhases.map((phaseGroup, index) => (
                    <PhaseSection key={phaseGroup.phaseName} phaseGroup={phaseGroup} index={index} />
                ))}
            </div>
        </div>
    );
};

export default ProjectProgress;
