
import React, { useState, useMemo, useEffect } from 'react';
import ToggleSwitch from '../components/ToggleSwitch';
import Modal from '../components/Modal';
import { WithdrawalRecord } from '../types';
import Tooltip from '../components/Tooltip';

const initialRecords: WithdrawalRecord[] = [
    { id: 'w1', timestamp: new Date(Date.now() - 86400000 * 1), amount: 5230.50, currency: 'USD', destinationAddress: '0xAb58...eC9B', status: 'Completed', txHash: '0x123...abc' },
    { id: 'w2', timestamp: new Date(Date.now() - 86400000 * 3), amount: 10000.00, currency: 'USD', destinationAddress: '0xAb58...eC9B', status: 'Completed', txHash: '0x456...def' },
    { id: 'w3', timestamp: new Date(Date.now() - 86400000 * 8), amount: 8500.75, currency: 'USD', destinationAddress: '0xOther...ddr1', status: 'Completed', txHash: '0x789...ghi' },
];

const Withdrawal: React.FC = () => {
  const [profitBalance] = useState(12540.88);
  const [walletAddress, setWalletAddress] = useState('0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B');
  const [tempWalletAddress, setTempWalletAddress] = useState(walletAddress);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isAddressValid, setIsAddressValid] = useState(true);
  const [isAuto, setIsAuto] = useState(true);
  const [threshold, setThreshold] = useState(10000);
  const [tempThreshold, setTempThreshold] = useState(10000);
  const [isEditingThreshold, setIsEditingThreshold] = useState(false);
  const [stealthMode, setStealthMode] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState(0);
  const [records, setRecords] = useState<WithdrawalRecord[]>(initialRecords);
  const [filterInterval, setFilterInterval] = useState<'24h' | '7d' | 'all'>('7d');

  useEffect(() => {
    if (isEditingAddress) {
      const isValid = /^0x[a-fA-F0-9]{40}$/.test(tempWalletAddress);
      setIsAddressValid(isValid);
    }
  }, [tempWalletAddress, isEditingAddress]);

  const handleSaveAddress = () => {
    if (!isAddressValid) return;
    setWalletAddress(tempWalletAddress);
    setIsEditingAddress(false);
    setSavedMessage('Wallet address updated successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleSaveThreshold = () => {
    setThreshold(tempThreshold);
    setIsEditingThreshold(false);
    setSavedMessage('Threshold updated successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleWithdraw = () => {
    if (withdrawalAmount <= 0 || withdrawalAmount > profitBalance) {
        alert("Invalid withdrawal amount.");
        return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmWithdrawal = () => {
    console.log(`Withdrawing ${withdrawalAmount} to ${walletAddress}`);
    // Here you would typically call an API
    const newRecord: WithdrawalRecord = {
        id: `w${records.length + 1}`,
        timestamp: new Date(),
        amount: withdrawalAmount,
        currency: 'USD',
        destinationAddress: `${walletAddress.slice(0,6)}...${walletAddress.slice(-4)}`,
        status: 'Pending',
        txHash: '0x' + [...Array(10)].map(() => Math.floor(Math.random() * 16).toString(16)).join('') + '...'
    };
    setRecords(prev => [newRecord, ...prev]);
    setIsModalOpen(false);
    setWithdrawalAmount(0);
    setSavedMessage('Withdrawal initiated!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const filteredRecords = useMemo(() => {
    const now = Date.now();
    return records.filter(r => {
        if (filterInterval === 'all') return true;
        const diff = now - r.timestamp.getTime();
        if (filterInterval === '24h') return diff < 86400000;
        if (filterInterval === '7d') return diff < 86400000 * 7;
        return true;
    });
  }, [records, filterInterval]);

  const totalWithdrawn = useMemo(() => filteredRecords.reduce((sum, r) => sum + r.amount, 0), [filteredRecords]);

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirm Withdrawal"
      >
        <p>You are about to withdraw:</p>
        <p className="text-2xl font-bold text-cyan-400 my-4">${withdrawalAmount.toLocaleString()}</p>
        <p>To the following address:</p>
        <p className="font-mono text-sm text-gray-400 break-all">{walletAddress}</p>
        <p className="mt-4 text-yellow-400 text-sm">Please ensure the address is correct. This action cannot be undone.</p>
         <div className="mt-6 flex justify-end space-x-4">
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-md transition-colors">Cancel</button>
            <button onClick={handleConfirmWithdrawal} className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-md transition-colors">Confirm</button>
        </div>
      </Modal>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column: Controls */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-lg p-6">
                <p className="text-base text-gray-400">Withdrawable Profit</p>
                <p className="text-2xl font-bold text-green-400">${profitBalance.toLocaleString()}</p>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-lg p-6 space-y-6">
                <h2 className="text-lg font-semibold text-white">Settings</h2>
                
                <Tooltip text="This is the destination wallet for all withdrawals. It can be changed without interrupting the engine.">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Withdrawal Wallet Address</label>
                        <div className="flex items-center space-x-2">
                            <input type="text" value={isEditingAddress ? tempWalletAddress : walletAddress} onChange={(e) => setTempWalletAddress(e.target.value)} readOnly={!isEditingAddress} className={`w-full p-2 rounded-md font-mono text-sm ${isEditingAddress ? 'bg-gray-700 text-white border-cyan-500' : 'bg-gray-800 text-gray-400 border-gray-600'} border transition-colors`} />
                            <button onClick={() => { setIsEditingAddress(!isEditingAddress); setTempWalletAddress(walletAddress); }} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md flex-shrink-0">
                                {isEditingAddress ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>}
                            </button>
                        </div>
                        {isEditingAddress && (
                            <>
                                {isAddressValid ? <p className="text-xs text-green-400 mt-1">Valid wallet address format.</p> : <p className="text-xs text-red-400 mt-1">Invalid wallet address format.</p>}
                                <button onClick={handleSaveAddress} disabled={!isAddressValid} className="mt-2 w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:bg-gray-600">Save Address</button>
                            </>
                        )}
                    </div>
                </Tooltip>

                <Tooltip text="Enable 'Auto' to automatically withdraw profits when the threshold is met. 'Manual' requires you to initiate each withdrawal.">
                    <div className="flex justify-between items-center bg-gray-900/50 p-3 rounded-md">
                        <span className="font-medium text-white">Withdrawal Mode</span>
                        <div className="flex items-center space-x-4"><span className={`text-sm ${!isAuto ? 'text-cyan-400' : 'text-gray-500'}`}>Manual</span><ToggleSwitch enabled={isAuto} onChange={setIsAuto} /><span className={`text-sm ${isAuto ? 'text-cyan-400' : 'text-gray-500'}`}>Auto</span></div>
                    </div>
                </Tooltip>

                {isAuto && (
                    <Tooltip text="The profit balance at which an automatic withdrawal will be triggered.">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Auto-Withdrawal Threshold (USD)</label>
                            {isEditingThreshold ? (
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <input type="number" value={tempThreshold} onChange={(e) => setTempThreshold(Number(e.target.value))} className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-cyan-500 focus:ring-cyan-500" />
                                        <button onClick={() => setIsEditingThreshold(false)} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md flex-shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                    <button onClick={handleSaveThreshold} className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-md transition duration-300">Save Threshold</button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <input type="text" value={`$${threshold.toLocaleString()}`} readOnly className="w-full p-2 rounded-md font-mono text-sm bg-gray-800 text-gray-400 border-gray-600 border" />
                                    <button onClick={() => { setIsEditingThreshold(true); setTempThreshold(threshold); }} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    </Tooltip>
                )}

                <Tooltip text="When enabled, withdrawals are routed through multiple intermediate wallets to obscure the trail from the engine to the final destination, enhancing privacy.">
                    <div className="flex justify-between items-center bg-gray-900/50 p-3 rounded-md">
                        <div><span className="font-medium text-white">Stealth Mode</span><p className="text-xs text-gray-500">Use intermediate wallets for privacy.</p></div>
                        <ToggleSwitch enabled={stealthMode} onChange={setStealthMode} />
                    </div>
                </Tooltip>
                {savedMessage && <p className="text-center text-green-400 text-sm animate-pulse">{savedMessage}</p>}
            </div>

            {!isAuto && (
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-lg p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-white">Manual Withdrawal</h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Amount (USD)</label>
                        <input type="number" value={withdrawalAmount} onChange={(e) => setWithdrawalAmount(Number(e.target.value))} max={profitBalance} className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-cyan-500 focus:ring-cyan-500" />
                    </div>
                    <button onClick={handleWithdraw} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded-md transition duration-300 text-base">Withdraw</button>
                </div>
            )}
        </div>

        {/* Right Column: Records */}
        <div className="lg:col-span-3 bg-gray-800/50 border border-gray-700 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-white">Withdrawal History</h2>
                <div className="flex space-x-1 bg-gray-900/50 p-1 rounded-md">
                    {(['24h', '7d', 'all'] as const).map(interval => (
                        <button key={interval} onClick={() => setFilterInterval(interval)} className={`px-3 py-1 text-xs rounded ${filterInterval === interval ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>{interval.toUpperCase()}</button>
                    ))}
                </div>
            </div>
            <div className="bg-gray-900/50 rounded-md p-4 mb-4">
                <p className="text-sm text-gray-400">Total Withdrawn ({filterInterval.toUpperCase()})</p>
                <p className="text-xl font-bold text-green-400">${totalWithdrawn.toLocaleString()}</p>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                        <tr>
                            {['Timestamp', 'Amount', 'Destination', 'Status', 'Tx Hash'].map(h => <th key={h} className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{h}</th>)}
                        </tr>
                    </thead>
                    <tbody className="bg-gray-900 divide-y divide-gray-700">
                        {filteredRecords.map(r => (
                            <tr key={r.id} className="hover:bg-gray-800/50">
                                <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-400">{r.timestamp.toLocaleString()}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-white">${r.amount.toLocaleString()}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-cyan-400">{r.destinationAddress}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${r.status === 'Completed' ? 'bg-green-900 text-green-300' : r.status === 'Pending' ? 'bg-yellow-900 text-yellow-300' : 'bg-red-900 text-red-300'}`}>{r.status}</span></td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-500">{r.txHash}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </>
  );
};

export default Withdrawal;
