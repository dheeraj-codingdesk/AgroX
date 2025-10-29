

import React from 'react';
import type { CropAnalysisResult } from '../types';
import { UploadIcon, CheckCircleIcon, XCircleIcon, SparklesIcon } from './icons/Icons';

interface CropAnalysisCardProps {
  previewUrls: string[];
  isLoading: boolean;
  error: string | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAnalyzeClick: () => void;
  onClearFiles: () => void;
  analysisResult: CropAnalysisResult | null;
}

const HealthBar: React.FC<{ score: number }> = ({ score }) => {
  const getBarColor = (s: number) => {
    if (s > 80) return 'bg-green-500';
    if (s > 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-4">
      <div
        className={`${getBarColor(score)} h-4 rounded-full transition-all duration-500`}
        style={{ width: `${score}%` }}
      ></div>
    </div>
  );
};

const CropAnalysisCard: React.FC<CropAnalysisCardProps> = ({
  previewUrls,
  isLoading,
  error,
  onFileChange,
  onAnalyzeClick,
  onClearFiles,
  analysisResult,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side: Uploader and Image Preview */}
        <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg min-h-[280px]">
          {previewUrls.length > 0 ? (
            <div className="w-full">
              <div className="grid grid-cols-3 gap-2 mb-4">
                {previewUrls.map((url, index) => (
                  <img key={index} src={url} alt={`Crop preview ${index + 1}`} className="w-full h-24 object-cover rounded-md" />
                ))}
              </div>
              <p className="text-sm text-center text-gray-600">{previewUrls.length} image(s) selected. Max 3.</p>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <UploadIcon className="w-12 h-12 mx-auto text-gray-400" />
              <p className="mt-2">Upload up to 3 photos of your crop</p>
              <p className="text-xs">PNG, JPG up to 10MB</p>
            </div>
          )}
          <input
            type="file"
            id="crop-image-upload"
            className="hidden"
            accept="image/png, image/jpeg"
            onChange={onFileChange}
            disabled={isLoading}
            multiple
          />
          <div className="flex items-center mt-4 space-x-2">
            <label
                htmlFor="crop-image-upload"
                className="cursor-pointer inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
                Choose Files
            </label>
            {previewUrls.length > 0 && (
                <button onClick={onClearFiles} className="bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 px-4 rounded-lg transition-colors">
                    Clear
                </button>
            )}
          </div>
        </div>

        {/* Right Side: Action and Results */}
        <div className="flex flex-col justify-center">
           <button
                onClick={onAnalyzeClick}
                disabled={previewUrls.length === 0 || isLoading}
                className="w-full flex items-center justify-center bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-transform transform hover:scale-105"
            >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    Analyze Crop
                  </>
                )}
            </button>
            {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
            
            {analysisResult && !isLoading && (
                 <div className="mt-6 space-y-4 animate-fade-in">
                    <h3 className="text-2xl font-bold text-gray-800">{analysisResult.cropName}</h3>
                    <p className="text-gray-600 text-md">{analysisResult.growthStage} Stage</p>
                    
                    <div className="space-y-2">
                         <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-700">Health Score</span>
                            <span className="font-bold text-lg">{analysisResult.healthScore}/100</span>
                        </div>
                        <HealthBar score={analysisResult.healthScore} />
                    </div>

                    {analysisResult.isHealthy ? (
                        <div className="flex items-center text-green-600 bg-green-50 p-3 rounded-lg">
                            <CheckCircleIcon className="w-6 h-6 mr-3"/>
                            <p className="font-semibold">Crop is healthy. {analysisResult.deficiency && `Potential issue: ${analysisResult.deficiency}`}</p>
                        </div>
                    ) : (
                         <div className="flex items-center text-red-600 bg-red-50 p-3 rounded-lg">
                            <XCircleIcon className="w-6 h-6 mr-3"/>
                            <p className="font-semibold">Disease Detected: {analysisResult.disease}</p>
                        </div>
                    )}
                 </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CropAnalysisCard;