

import React, { useState, useCallback, useEffect } from 'react';
import type { CropAnalysisResult, SoilData, WeatherData, MarketData, ChatMessage, User } from '../types';
import { analyzeCrop, createChat, sendMessageToChat, getMarketData, refineHarvestSuggestion } from '../services/geminiService';
import { requestCallback } from '../services/vapiService';
import type { Chat } from '@google/genai';
import { getSoilData, getWeatherData } from '../services/mockApi';
import Header from './Header';
import CropAnalysisCard from './CropAnalysisCard';
import InfoCard from './InfoCard';
import RecommendationCard from './RecommendationCard';
import ChatbotCard from './ChatbotCard';
import DetectedIssuesCard from './DetectedIssuesCard';
import SoilInformationCard from './SoilInformationCard';
import { SunIcon, WaterIcon, DollarSignIcon, SproutIcon, PhoneIcon } from './icons/Icons';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [analysisResult, setAnalysisResult] = useState<CropAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const [soilData, setSoilData] = useState<SoilData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isMarketDataLoading, setIsMarketDataLoading] = useState<boolean>(true);

  // Chatbot state
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  // Callback state
  const [isCallbackLoading, setIsCallbackLoading] = useState<boolean>(false);
  const [callbackStatus, setCallbackStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Fetch initial data (soil, weather, general market)
  useEffect(() => {
    const fetchInitialData = async () => {
        setIsMarketDataLoading(true);
        const soilPromise = getSoilData(user.location);
        const weatherPromise = getWeatherData(user.location);
        const marketPromise = getMarketData(user.location); // General trends

        const [soil, weather, market] = await Promise.all([soilPromise, weatherPromise, marketPromise]);
        
        setSoilData(soil);
        setWeatherData(weather);
        setMarketData(market);
        setIsMarketDataLoading(false);
    };
    fetchInitialData();
  }, [user.location]);

  // Fetch specific market data and refine harvest suggestion when a crop is analyzed
  useEffect(() => {
    if (analysisResult?.cropName && !analysisResult.harvestSuggestion.isRefined) {
      const fetchMarketDataAndRefineSuggestion = async () => {
        setIsMarketDataLoading(true);
        try {
          const market = await getMarketData(user.location, analysisResult.cropName);
          setMarketData(market);

          if (weatherData) {
            const refinedResult = await refineHarvestSuggestion(analysisResult, market, weatherData);
            setAnalysisResult(refinedResult);
          }
        } catch (error) {
          console.error("Failed to fetch market data or refine suggestion:", error);
        } finally {
          setIsMarketDataLoading(false);
        }
      };
      fetchMarketDataAndRefineSuggestion();
    }
  }, [analysisResult, user.location, weatherData]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileList = Array.from(files).slice(0, 3); // Max 3 files
      setSelectedFiles(fileList);
      
      const newPreviewUrls: string[] = [];
      const filePromises = fileList.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(filePromises).then(urls => {
        setPreviewUrls(urls);
      });

      setAnalysisResult(null);
      setError(null);
      setChatMessages([]);
      setChatSession(null);
    }
  };

  const handleClearFiles = () => {
    setSelectedFiles([]);
    setPreviewUrls([]);
    setAnalysisResult(null);
    setError(null);
    setChatMessages([]);
    setChatSession(null);
    const input = document.getElementById('crop-image-upload') as HTMLInputElement;
    if (input) {
        input.value = '';
    }
  };

  const handleAnalyzeClick = useCallback(async () => {
    if (selectedFiles.length === 0 || !soilData || !weatherData) {
      setError('Please select at least one file and ensure all data is loaded.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setChatMessages([]);

    try {
      const result = await analyzeCrop(selectedFiles, soilData, weatherData, user.location);
      setAnalysisResult(result);
      const newChat = createChat(user.location);
      setChatSession(newChat);
      setChatMessages([
        { role: 'model', content: 'Analysis complete! Ask me anything about the crop image or your local area.' }
      ]);
    } catch (err) {
      console.error(err);
      setError('An error occurred during analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedFiles, soilData, weatherData, user.location]);

  const handleSendMessage = async (message: string) => {
    if (!chatSession || selectedFiles.length === 0) return;

    const userMessage: ChatMessage = { role: 'user', content: message };
    setChatMessages(prev => [...prev, userMessage]);
    setIsChatLoading(true);

    try {
      const isFirstUserMessage = !chatMessages.some(m => m.role === 'user');
      const imagesToSend = isFirstUserMessage ? selectedFiles : undefined;
      
      const { text: responseText, sources } = await sendMessageToChat(chatSession, message, imagesToSend);
      
      const modelMessage: ChatMessage = { role: 'model', content: responseText, sources };
      setChatMessages(prev => [...prev, modelMessage]);
    } catch (err) {
      console.error("Error sending chat message:", err);
      setChatMessages(prev => [...prev, { role: 'model', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleRequestCallback = useCallback(async () => {
    setIsCallbackLoading(true);
    setCallbackStatus(null);

    try {
        await requestCallback(user.phone);
        setCallbackStatus({ type: 'success', message: 'Call initiated! You will receive a call shortly.' });
    } catch (err) {
        console.error(err);
        setCallbackStatus({ type: 'error', message: 'Failed to request callback. Please try again.' });
    } finally {
        setIsCallbackLoading(false);
        setTimeout(() => {
            setCallbackStatus(null);
        }, 5000); // Clear message after 5 seconds
    }
  }, [user.phone]);


  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header onLogout={onLogout} />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <CropAnalysisCard
              previewUrls={previewUrls}
              isLoading={isLoading}
              error={error}
              onFileChange={handleFileChange}
              onAnalyzeClick={handleAnalyzeClick}
              analysisResult={analysisResult}
              onClearFiles={handleClearFiles}
            />
            {analysisResult && (
              <div className="space-y-8 animate-fade-in">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <DetectedIssuesCard issues={analysisResult.detectedIssues} />
                  {soilData && <SoilInformationCard soilData={soilData} />}
                </div>
                <ChatbotCard
                  messages={chatMessages}
                  onSendMessage={handleSendMessage}
                  isLoading={isChatLoading}
                  disabled={!analysisResult}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <RecommendationCard
                    icon={<SproutIcon className="w-8 h-8 text-green-600" />}
                    title="Soil & Treatment"
                    recommendations={analysisResult.soilAnalysis.recommendations}
                    color="green"
                  />
                  <RecommendationCard
                    icon={<SunIcon className="w-8 h-8 text-yellow-600" />}
                    title="Weather-Based Actions"
                    recommendations={analysisResult.weatherRecommendations}
                    color="yellow"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <InfoCard
                    icon={<SproutIcon className="w-8 h-8 text-lime-600" />}
                    title="Next Crop Suggestion"
                    value={analysisResult.nextCropSuggestion.cropName}
                    details={analysisResult.nextCropSuggestion.reason}
                  />
                  <InfoCard
                    icon={<DollarSignIcon className="w-8 h-8 text-emerald-600" />}
                    title="Harvest & Market"
                    value={analysisResult.harvestSuggestion.action}
                    details={`Optimal harvest time: ${analysisResult.harvestSuggestion.timing}`}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-gray-700 border-b-2 border-green-200 pb-2">Your Farm Conditions</h2>
            {weatherData && (
              <InfoCard
                icon={<SunIcon className="w-8 h-8 text-orange-500" />}
                title="Weather Status"
                value={weatherData.summary}
                details={weatherData.outlook}
              />
            )}
            {soilData && (
              <InfoCard
                icon={<WaterIcon className="w-8 h-8 text-blue-500" />}
                title="Soil Condition"
                value={`Moisture: ${soilData.moisture}%`}
                details={`pH ${soilData.ph}, ${soilData.healthStatus} Health`}
              />
            )}
            {isMarketDataLoading ? (
                <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 flex items-center justify-center min-h-[108px]">
                    <svg className="animate-spin h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="ml-3 text-gray-600">Fetching Market Trends...</p>
                </div>
            ) : marketData && (
              <InfoCard
                icon={<DollarSignIcon className="w-8 h-8 text-green-500" />}
                title="Market Trends"
                value={marketData.trend}
                details={marketData.summary}
                sources={marketData.sources}
              />
            )}
            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Support</h3>
                <p className="text-sm text-gray-600 mb-4">Need help? Request a callback from our support team to your registered phone number.</p>
                <button
                    onClick={handleRequestCallback}
                    disabled={isCallbackLoading}
                    className="w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {isCallbackLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Requesting...
                        </>
                    ) : (
                        <>
                            <PhoneIcon className="w-5 h-5 mr-2" />
                            Request a Callback
                        </>
                    )}
                </button>
                {callbackStatus && (
                    <p className={`text-sm mt-3 text-center ${callbackStatus.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                        {callbackStatus.message}
                    </p>
                )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;