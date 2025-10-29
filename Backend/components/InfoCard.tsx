
import React from 'react';
import { LinkIcon } from './icons/Icons';
import type { GroundingSource } from '../types';

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  details: string;
  sources?: GroundingSource[];
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, value, details, sources }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 flex flex-col justify-between">
      <div>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            {icon}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase">{title}</h3>
            <p className="text-xl font-bold text-gray-800 mt-1">{value}</p>
            <p className="text-sm text-gray-600 mt-1">{details}</p>
          </div>
        </div>
      </div>
       {sources && sources.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
            <h4 className="text-xs font-semibold text-gray-500 mb-2 flex items-center"><LinkIcon className="w-3.5 h-3.5 mr-1.5"/> Sources</h4>
            <ul className="space-y-1">
                {sources.slice(0, 2).map((source, i) => (
                    <li key={i} className="truncate text-xs">
                        <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{source.title}</a>
                    </li>
                ))}
            </ul>
        </div>
      )}
    </div>
  );
};

export default InfoCard;