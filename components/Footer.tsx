
import React from 'react';
import { GcpIcon } from './icons/GcpIcon';
import { LogoIcon } from './icons/LogoIcon';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 border-t border-cyan-500/10 mt-8">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <LogoIcon className="h-5 w-5 text-gray-600" />
          <span>Orion 2026 &reg;</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>Powered by</span>
          <GcpIcon className="h-5" />
          <span className="font-semibold text-gray-400">Google Cloud</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
