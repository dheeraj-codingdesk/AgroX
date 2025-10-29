
import React from 'react';
import { CheckCircleIcon } from './icons/Icons';

interface RecommendationCardProps {
  icon: React.ReactNode;
  title: string;
  recommendations: string[];
  color: 'green' | 'yellow' | 'blue';
}

const colorClasses = {
    green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-800',
        icon: 'text-green-600',
    },
    yellow: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        text: 'text-yellow-800',
        icon: 'text-yellow-600',
    },
    blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        icon: 'text-blue-600',
    },
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ icon, title, recommendations, color }) => {
  const classes = colorClasses[color];
  return (
    <div className={`${classes.bg} p-6 rounded-xl shadow-md border ${classes.border}`}>
      <div className="flex items-center mb-4">
        {icon}
        <h3 className={`ml-3 text-lg font-semibold ${classes.text}`}>{title}</h3>
      </div>
      <ul className="space-y-3">
        {recommendations.map((rec, index) => (
          <li key={index} className="flex items-start">
            <CheckCircleIcon className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${classes.icon}`} />
            <span className={`text-sm ${classes.text}`}>{rec}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecommendationCard;
