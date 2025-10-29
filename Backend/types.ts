

export interface SoilData {
  moisture: number;
  healthStatus: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  nutrients: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  ph: number;
  fertility: 'High' | 'Medium' | 'Low';
}

export interface WeatherData {
  summary: string;
  outlook: string; // e.g., "Sunny with occasional clouds"
  forecast: Array<{ day: string; temp: number; condition: string }>;
}

export interface MarketData {
  trend: 'Rising' | 'Stable' | 'Falling';
  summary: string;
  sources?: GroundingSource[];
}

export interface CropAnalysisResult {
  cropName: string;
  growthStage: string;
  healthScore: number;
  isHealthy: boolean;
  disease?: string;
  deficiency?: string;
  detectedIssues: {
    diseases: number;
    pests: number;
    nutrientDeficiency: number;
    waterStress: number;
  };
  soilAnalysis: {
    recommendations: string[];
  };
  weatherRecommendations: string[];
  harvestSuggestion: {
    timing: string;
    action: string;
    isRefined?: boolean;
  };
  nextCropSuggestion: {
    cropName: string;
    reason: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  password?: string;
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  sources?: GroundingSource[];
}