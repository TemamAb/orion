
import React from 'react';
import { DeploymentRecord } from '../types';

interface RegistryProps {
  records: DeploymentRecord[];
}

const Registry: React.FC<RegistryProps> = ({ records }) => {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
      <div className="p-4">
        <h2 className="text-xl font-semibold text-white">Deployment Registry</h2>
        <p className="text-sm text-gray-400">Records of all deployed smart wallets and contracts.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              {['Smart Wallet Address', 'Contract', 'Blockchain', 'Infrastructure', 'Deployment Time', 'Status'].map(header => (
                <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-700">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-gray-800/50 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-cyan-400">{record.smartWalletAddress}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{record.contractNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{record.blockchain}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{record.infrastructure}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{record.timestamp}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.status === 'Active' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Registry;
