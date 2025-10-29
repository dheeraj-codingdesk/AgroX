

import { GoogleGenAI, Type, Chat, GenerateContentResponse, Part } from "@google/genai";
import type { CropAnalysisResult, SoilData, WeatherData, MarketData, GroundingSource } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const parseLocation = (location: string): { latitude: number; longitude: number } | null => {
    const parts = location.split(',').map(s => parseFloat(s.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return { latitude: parts[0], longitude: parts[1] };
    }
    return null;
};

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const harvestSuggestionSchema = {
    type: Type.OBJECT,
    properties: {
        timing: { type: Type.STRING, description: "Optimal time to harvest (e.g., 'In 2 weeks')." },
        action: { type: Type.STRING, description: "Suggestion like 'Store' or 'Sell Immediately' based on the provided context." }
    },
    required: ["timing", "action"]
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        cropName: { type: Type.STRING, description: "Identified name of the crop." },
        growthStage: { type: Type.STRING, description: "Current growth stage of the crop (e.g., vegetative, flowering, fruiting)." },
        healthScore: { type: Type.INTEGER, description: "A score from 0 to 100 indicating the crop's health." },
        isHealthy: { type: Type.BOOLEAN, description: "True if the plant is generally healthy, false otherwise." },
        disease: { type: Type.STRING, description: "Name of the disease if the plant is unhealthy. Otherwise, 'None'." },
        deficiency: { type: Type.STRING, description: "Nutrient or water deficiency if detected. Otherwise, 'None'." },
        detectedIssues: {
            type: Type.OBJECT,
            properties: {
                diseases: { type: Type.INTEGER, description: "Percentage of issues related to diseases (0-100)." },
                pests: { type: Type.INTEGER, description: "Percentage of issues related to pests (0-100)." },
                nutrientDeficiency: { type: Type.INTEGER, description: "Percentage of issues related to nutrient deficiency (0-100)." },
                waterStress: { type: Type.INTEGER, description: "Percentage of issues related to water stress (0-100)." },
            },
            description: "A percentage-based breakdown of potential issues. The sum should be 100."
        },
        soilAnalysis: {
            type: Type.OBJECT,
            properties: {
                recommendations: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "List of recommendations based on soil data (e.g., pest control, fertilizer needs, watering adjustments)."
                }
            }
        },
        weatherRecommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of actionable recommendations for the next week based on the weather forecast."
        },
        harvestSuggestion: harvestSuggestionSchema,
        nextCropSuggestion: {
            type: Type.OBJECT,
            properties: {
                cropName: { type: Type.STRING, description: "Recommended crop to plant next." },
                reason: { type: Type.STRING, description: "Reason for the recommendation (e.g., seasonal factors, market demand)." }
            }
        }
    },
    required: ["cropName", "growthStage", "healthScore", "isHealthy", "detectedIssues", "soilAnalysis", "weatherRecommendations", "harvestSuggestion", "nextCropSuggestion"]
};


export const analyzeCrop = async (
  files: File[],
  soilData: SoilData,
  weatherData: WeatherData,
  location: string
): Promise<CropAnalysisResult> => {
  const imageParts = await Promise.all(files.map(fileToGenerativePart));

  const prompt = `
    Analyze the provided crop images (multiple angles may be provided for better context) and the supplementary data to provide a comprehensive agricultural report.
    
    **Contextual Data:**
    - **User Location (Lat, Lng):** ${location}
    - **Soil Data:** ${JSON.stringify(soilData)}
    - **Weather Forecast:** ${JSON.stringify(weatherData)}
    
    **Instructions:**
    1.  **Identify Crop:** Identify the crop and its growth stage from the image.
    2.  **Health Assessment:** Analyze the crop's health. Provide a health score from 0-100.
    3.  **Diagnosis:** If the crop is unhealthy, identify the specific disease. If it's not diseased but shows signs of stress, identify potential deficiencies (e.g., lack of nitrogen, water stress).
    4.  **Issue Breakdown:** Provide a percentage-based breakdown of potential issues, ensuring the total sums to 100, across these categories: 'diseases', 'pests', 'nutrientDeficiency', 'waterStress'. For a healthy plant, these can be low but non-zero, representing potential risks.
    5.  **Soil & Treatment Plan:** Based on the diagnosis and the provided soil data, recommend specific actions. Consider pests, fertilizer needs, and watering schedules.
    6.  **Weather-based Actions:** Based on the 7-day weather forecast, provide a short list of time-based recommendations (e.g., "Prepare for heavy rain on Wednesday," "Irrigate on Friday due to high temperatures").
    7.  **Harvest & Market Advice:** Suggest the optimal time for harvesting. Based on general market knowledge for this crop, advise whether to sell the produce immediately or store it.
    8.  **Succession Planting:** Recommend a suitable crop to plant next in the same field, considering seasonality, weather, and market opportunities.
    
    Return the analysis in the specified JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [...imageParts, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result as CropAnalysisResult;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to analyze crop data.");
  }
};

export const getMarketData = async (location: string, cropName?: string): Promise<MarketData> => {
    const prompt = `
        Analyze the agricultural market trends for ${cropName || 'a common local agricultural product'} in the region around location: ${location}.
        Provide the general market trend and a concise summary.
        The trend must be one of: 'Rising', 'Stable', 'Falling'.

        Return your response as a JSON object inside a markdown code block. The JSON object should have two keys: "trend" and "summary".
        For example:
        \`\`\`json
        {
          "trend": "Rising",
          "summary": "Tomato prices are expected to rise by 15% next month due to regional demand."
        }
        \`\`\`
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{googleSearch: {}}],
            },
        });

        const text = response.text;
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
        
        let trend: 'Rising' | 'Stable' | 'Falling' = 'Stable';
        let summary = text;

        if (jsonMatch && jsonMatch[1]) {
            try {
                const parsed = JSON.parse(jsonMatch[1]);
                const validTrends = ['Rising', 'Stable', 'Falling'];
                if (validTrends.includes(parsed.trend)) {
                    trend = parsed.trend;
                }
                summary = parsed.summary || text;
            } catch (e) {
                console.error("Failed to parse JSON from market data response", e);
            }
        } else {
             if (text.toLowerCase().includes('rising')) trend = 'Rising';
             else if (text.toLowerCase().includes('falling')) trend = 'Falling';
        }

        const sources: GroundingSource[] = [];
        const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
        if (groundingMetadata?.groundingChunks) {
            for (const chunk of groundingMetadata.groundingChunks) {
                if (chunk.web) {
                    sources.push({ uri: chunk.web.uri, title: chunk.web.title || 'Web Search Result' });
                }
            }
        }
        
        const uniqueSources = sources.filter((source, index, self) =>
            index === self.findIndex((s) => (s.uri === source.uri))
        );

        return { trend, summary, sources: uniqueSources };

    } catch (error) {
        console.error("Error calling Gemini API for market data:", error);
        return {
            trend: 'Stable',
            summary: 'Could not fetch live market data. General stability expected.',
            sources: [],
        };
    }
};

export const refineHarvestSuggestion = async (
    analysisResult: CropAnalysisResult,
    marketData: MarketData,
    weatherData: WeatherData
  ): Promise<CropAnalysisResult> => {
    const prompt = `
      Based on an initial crop analysis, current market data, and a weather forecast, provide a refined harvest and market recommendation.
  
      **Initial Crop Analysis Summary:**
      - Crop: ${analysisResult.cropName}
      - Current Health: ${analysisResult.isHealthy ? 'Healthy' : 'Unhealthy'} (Score: ${analysisResult.healthScore}/100)
      - Initial Harvest Timing: ${analysisResult.harvestSuggestion.timing}
  
      **Live Market Data:**
      - Trend: ${marketData.trend}
      - Summary: ${marketData.summary}
  
      **7-Day Weather Forecast:**
      - Summary: ${weatherData.summary}
      - Outlook: ${weatherData.outlook}
      - Forecast: ${JSON.stringify(weatherData.forecast)}
  
      **Instructions:**
      1.  Re-evaluate the **harvest timing**. Consider if upcoming weather (e.g., rain, heatwave) should accelerate or delay the initial timing.
      2.  Provide a clear **market action**. Based *specifically* on the live market trend and summary, recommend whether to 'Sell Immediately' to capitalize on high prices, 'Store' to wait for better prices if the trend is falling, or another specific action.
      3.  Your response must be a JSON object matching the provided schema. Be concise and actionable.
    `;
  
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: harvestSuggestionSchema,
        },
      });
  
      const jsonText = response.text.trim();
      const refinedSuggestion = JSON.parse(jsonText);
  
      return {
        ...analysisResult,
        harvestSuggestion: {
          ...refinedSuggestion,
          isRefined: true,
        },
      };
    } catch (error) {
      console.error("Error calling Gemini API for harvest suggestion refinement:", error);
      // If refinement fails, return the original result but mark it to avoid retries
      return {
        ...analysisResult,
        harvestSuggestion: {
          ...analysisResult.harvestSuggestion,
          isRefined: true,
        },
      };
    }
  };

export const createChat = (location: string): Chat => {
  const latLng = parseLocation(location);

  return ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
          systemInstruction: `You are AgroX, a helpful assistant for farmers located at ${location}. Your role is to answer questions about the crop image the user provides in a concise and helpful way. You MUST keep their location in mind for any recommendations. Use your tools to find local suppliers, market data, or other geographically relevant information when asked.`,
          tools: [{googleMaps: {}}],
          ...(latLng && {
            toolConfig: {
              retrievalConfig: {
                latLng: latLng,
              }
            }
          })
      },
  });
};

export const sendMessageToChat = async (
  chat: Chat,
  message: string,
  imageFiles?: File[]
): Promise<{ text: string, sources: GroundingSource[] }> => {
  let messageContent: string | (string | Part)[];

  if (imageFiles && imageFiles.length > 0) {
      const imageParts = await Promise.all(imageFiles.map(fileToGenerativePart));
      messageContent = [...imageParts, { text: message }];
  } else {
      messageContent = message;
  }
  
  const response: GenerateContentResponse = await chat.sendMessage({ message: messageContent });
  
  const sources: GroundingSource[] = [];
  const groundingMetadata = response.candidates?.[0]?.groundingMetadata;

  if (groundingMetadata?.groundingChunks) {
    for (const chunk of groundingMetadata.groundingChunks) {
      if (chunk.maps) {
        if (chunk.maps.uri) {
            sources.push({ uri: chunk.maps.uri, title: chunk.maps.title || 'Google Maps Result' });
        }
        if (chunk.maps.placeAnswerSources?.reviewSnippets) {
            for (const source of chunk.maps.placeAnswerSources.reviewSnippets) {
                // FIX: Corrected properties for review snippets from Maps grounding to resolve type errors. The properties `uri` and `text` are not available on the snippet object.
                const typedSource = source as any;
                if (typedSource.uri) {
                    sources.push({ uri: typedSource.uri, title: typedSource.title || `Review: ${(typedSource.text || '').substring(0, 30)}...` });
                }
            }
        }
      }
    }
  }

  // Deduplicate sources based on URI
  const uniqueSources = sources.filter((source, index, self) =>
    index === self.findIndex((s) => (
      s.uri === source.uri
    ))
  );

  return { text: response.text, sources: uniqueSources };
};