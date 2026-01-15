
import React from 'react';
import Tooltip from './Tooltip';

interface MetricCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  colorClass: string;
  tooltipText: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, icon, colorClass, tooltipText }) => {
  return (
    <Tooltip text={tooltipText}>
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex items-center space-x-4 shadow-lg hover:shadow-cyan-500/10 transition-shadow duration-300 w-full">
          <div className={`p-3 rounded-full ${colorClass}`}>
            {icon}
          </div>
          <div>
            <p className="text-sm text-gray-400">{label}</p>
            <p className="text-lg font-bold text-white">{value}</p>
          </div>
        </div>
    </Tooltip>
  );
};

export default MetricCard;
