
import React from 'react';
import type { SoilData } from '../types';

const InfoBar: React.FC<{ value: number; max?: number; color: string }> = ({ value, max = 100, color }) => (
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div className={`${color} h-2 rounded-full transition-all duration-500`} style={{ width: `${(value / max) * 100}%` }}></div>
  </div>
);

const SoilInformationCard: React.FC<{ soilData: SoilData }> = ({ soilData }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Soil Information</h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1 text-sm font-medium text-gray-700">
            <span>Soil Moisture (%)</span>
            <span>{soilData.moisture}</span>
          </div>
          <InfoBar value={soilData.moisture} color="bg-blue-500" />
        </div>
        <div>
          <div className="flex justify-between mb-1 text-sm font-medium text-gray-700">
            <span>Phosphorus</span>
            <span>{soilData.nutrients.phosphorus}</span>
          </div>
          <InfoBar value={soilData.nutrients.phosphorus} color="bg-green-500" />
        </div>
        <div>
          <div className="flex justify-between mb-1 text-sm font-medium text-gray-700">
            <span>Potassium</span>
            <span>{soilData.nutrients.potassium}</span>
          </div>
          <InfoBar value={soilData.nutrients.potassium} color="bg-yellow-500" />
        </div>
        <div>
          <div className="flex justify-between mb-1 text-sm font-medium text-gray-700">
            <span>Neutral pH</span>
            <span>{soilData.ph}</span>
          </div>
          <InfoBar value={soilData.ph} max={14} color="bg-indigo-500" />
        </div>
        <div className="text-center pt-2">
            <span className="text-sm font-medium text-gray-500">Fertility: </span>
            <span className="font-semibold text-gray-800 rounded-full bg-gray-100 px-3 py-1">{soilData.fertility}</span>
        </div>
      </div>
    </div>
  );
};

export default SoilInformationCard;
