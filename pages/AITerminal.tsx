
import React, { useState, useRef, useEffect } from 'react';
import { LogoIcon } from '../components/icons/LogoIcon';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const AITerminal: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: "Welcome to the Orion AI Terminal. I am trained to build, deploy, and monitor arbitrage strategies by forging alpha from the top seven strategies and their corresponding wallets. How can I assist you today? You can ask me to 'deploy new strategy', 'monitor wallets', or 'check system status'.",
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const generateAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    if (lowerInput.includes('deploy')) {
      return 'Initializing deployment protocol... Analyzing Cross-DEX Arbitrage strategy for high-potential alpha wallets. Forging new execution pattern... Please confirm deployment to Arbitrum network with a gas limit of 0.05 ETH.';
    }
    if (lowerInput.includes('monitor') || lowerInput.includes('wallets')) {
      return 'Monitoring active alpha wallets... Detected 3 new wallets showing profitable patterns within the Triangular Arbitrage strategy. Average PnL: $152.33. Win Rate: 88%. Forging their patterns for potential execution.';
    }
    if (lowerInput.includes('status') || lowerInput.includes('check')) {
      return 'System status: All systems nominal. Scanner bots latency at 12ms. Orchestrator AI core is operating at 98.7% forging precision. 5 active strategies are running. Total PnL for the last hour: $2,450.68.';
    }
    if (lowerInput.includes('build')) {
      return 'To build a new strategy, please define the core logic. For example: "Build a liquidation arbitrage strategy targeting Aave v3 on Base network." I will then analyze market conditions and forge an execution plan.';
    }
    if (lowerInput.includes('strategies') || lowerInput.includes('alpha')) {
        return 'Currently tracking 7 alpha strategies. The top 3 by recent PnL are: 1. Cross-DEX Arbitrage, 2. Triangular Arbitrage, 3. Liquidation Arbitrage. I can provide detailed metrics for any specific strategy.';
    }
    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
        return 'Hello. Orion AI is online and ready for commands.';
    }
    return "I'm sorry, I don't understand that command. Please try asking me to 'deploy', 'monitor', or 'check status'.";
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = { sender: 'user', text: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    setTimeout(() => {
      const aiResponse: Message = {
        sender: 'ai',
        text: generateAIResponse(userMessage.text),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[75vh] bg-gray-800/50 border border-gray-700 rounded-lg shadow-2xl shadow-cyan-500/10">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-white">AI Terminal</h2>
        <p className="text-sm text-gray-400">Interact with the Orion core AI</p>
      </div>
      <div className="flex-grow p-4 overflow-y-auto font-mono text-sm">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 my-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'ai' && <LogoIcon className="h-6 w-6 text-cyan-400 flex-shrink-0 mt-1" />}
            <div className={`max-w-2xl p-3 rounded-lg ${msg.sender === 'user' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-gray-700/50 text-gray-300'}`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3 my-4">
            <LogoIcon className="h-6 w-6 text-cyan-400 flex-shrink-0 mt-1 animate-pulse" />
            <div className="max-w-2xl p-3 rounded-lg bg-gray-700/50 text-gray-300">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-700">
        <form onSubmit={handleSendMessage} className="flex items-center gap-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask the AI to build, deploy, or monitor..."
            className="flex-grow bg-gray-700 border border-gray-600 rounded-md p-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default AITerminal;
