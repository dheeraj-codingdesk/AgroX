import React from 'react';
import { LeafIcon, LogOutIcon } from './icons/Icons';

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">
            <LeafIcon className="w-8 h-8 text-green-600 mr-3"/>
            <h1 className="text-2xl font-bold text-gray-800">
              Agro<span className="text-green-600">X</span>
            </h1>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center text-gray-600 hover:text-red-500 font-semibold transition-colors rounded-lg p-2 -mr-2"
          aria-label="Logout"
        >
          <LogOutIcon className="w-5 h-5 mr-2" />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;