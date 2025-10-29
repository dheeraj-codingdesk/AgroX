
import React from 'react';

interface DetectedIssuesProps {
  issues: {
    diseases: number;
    pests: number;
    nutrientDeficiency: number;
    waterStress: number;
  };
}

const DonutSegment: React.FC<{ radius: number; strokeWidth: number; color: string; percentage: number; offset: number }> = ({ radius, strokeWidth, color, percentage, offset }) => {
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = `${circumference * (percentage / 100)} ${circumference}`;
    const strokeDashoffset = -circumference * (offset / 100);
  
    return (
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="transparent"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
        className="transition-all duration-500"
      />
    );
  };
  
const DonutChart: React.FC<DetectedIssuesProps> = ({ issues }) => {
    const radius = 30;
    const strokeWidth = 15;

    const data = [
      { name: 'Diseases', value: issues.diseases, color: '#f59e0b' },
      { name: 'Pests', value: issues.pests, color: '#ef4444' },
      { name: 'Nutrient Deficiency', value: issues.nutrientDeficiency, color: '#84cc16' },
      { name: 'Water Stress', value: issues.waterStress, color: '#3b82f6' },
    ];
    let cumulative = 0;

    return (
        <svg viewBox="0 0 100 100" className="w-32 h-32 transform -rotate-90">
            <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#e5e7eb" strokeWidth={strokeWidth} />
            {data.map((d, i) => {
                const segment = <DonutSegment key={i} radius={radius} strokeWidth={strokeWidth} color={d.color} percentage={d.value} offset={cumulative} />;
                cumulative += d.value;
                return segment;
            })}
        </svg>
    );
};


const DetectedIssuesCard: React.FC<DetectedIssuesProps> = ({ issues }) => {
  const issueData = [
    { name: 'Diseases', color: 'bg-amber-500', value: issues.diseases },
    { name: 'Pests', color: 'bg-red-500', value: issues.pests },
    { name: 'Nutrient Deficiency', color: 'bg-lime-500', value: issues.nutrientDeficiency },
    { name: 'Water Stress', color: 'bg-blue-500', value: issues.waterStress },
  ];
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Crop Health Analytics</h3>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="flex-shrink-0">
          <DonutChart issues={issues} />
        </div>
        <div className="w-full">
          <p className="text-sm font-semibold text-gray-600 mb-3">Detected Issues</p>
          <ul className="space-y-2">
            {issueData.map(item => (
              <li key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <span className={`w-3 h-3 rounded-full mr-2 ${item.color}`}></span>
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-semibold text-gray-800">{item.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DetectedIssuesCard;
