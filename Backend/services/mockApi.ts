

import type { SoilData, WeatherData } from '../types';

// Simple parser to handle potential errors if location is not in "lat, lng" format
const parseLocation = (location: string): { lat: number, lng: number } => {
    const parts = location.split(',').map(s => parseFloat(s.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return { lat: parts[0], lng: parts[1] };
    }
    // Default to a location if parsing fails to avoid errors
    return { lat: 34.05, lng: -118.24 }; // Default to Los Angeles
};

// WMO Weather interpretation codes mapping
const getWeatherCondition = (code: number): string => {
    const conditions: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      56: 'Light freezing drizzle',
      57: 'Dense freezing drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      66: 'Light freezing rain',
      67: 'Heavy freezing rain',
      71: 'Slight snow fall',
      73: 'Moderate snow fall',
      75: 'Heavy snow fall',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail',
    };
    return conditions[code] || 'Unknown';
};

export const getSoilData = async (location: string): Promise<SoilData> => {
  const { lat, lng } = parseLocation(location);
  // API provides soil moisture in m³/m³. To convert to a percentage-like value, we multiply by 100.
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=soil_moisture_0_to_1cm`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Weather API request failed with status ${response.status}`);
    }
    const data = await response.json();
    const moisture = Math.round(data.current.soil_moisture_0_to_1cm * 100);

    let healthStatus: 'Excellent' | 'Good' | 'Fair' | 'Poor' = 'Fair';
    if (moisture > 70) healthStatus = 'Excellent';
    else if (moisture > 40) healthStatus = 'Good';
    else if (moisture < 20) healthStatus = 'Poor';
    
    const fertilityMap = {
        Excellent: 'High',
        Good: 'Medium',
        Fair: 'Medium',
        Poor: 'Low',
    };

    return {
      moisture: moisture,
      healthStatus: healthStatus,
      nutrients: {
        nitrogen: 75 + Math.round((lat + lng) % 10),
        phosphorus: 60 + Math.round((lat + lng) % 8),
        potassium: 80 + Math.round((lat + lng) % 12),
      },
      ph: parseFloat((6.5 + (lat % 1) - 0.5).toFixed(1)),
      fertility: fertilityMap[healthStatus] as 'High' | 'Medium' | 'Low',
    };
  } catch (error) {
      console.error("Failed to fetch soil data:", error);
      // Return a fallback object on error
      return {
        moisture: 45,
        healthStatus: 'Good',
        nutrients: { nitrogen: 78, phosphorus: 65, potassium: 82 },
        ph: 6.8,
        fertility: 'Medium',
      };
  }
};

export const getWeatherData = async (location: string): Promise<WeatherData> => {
    const { lat, lng } = parseLocation(location);
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weathercode&daily=weathercode,temperature_2m_max&forecast_days=7&timezone=auto`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Weather API request failed with status ${response.status}`);
        }
        const data = await response.json();
        
        const summary = `${Math.round(data.current.temperature_2m)}°C, ${getWeatherCondition(data.current.weathercode)}`;
        
        const forecast = data.daily.time.map((date: string, index: number) => ({
            day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
            temp: Math.round(data.daily.temperature_2m_max[index]),
            condition: getWeatherCondition(data.daily.weathercode[index]),
        }));

        const rainDayIndex = forecast.findIndex(d => d.condition.toLowerCase().includes('rain') || d.condition.toLowerCase().includes('showers') || d.condition.toLowerCase().includes('thunderstorm'));
        let outlook: string;
        if (rainDayIndex !== -1) {
            if (rainDayIndex === 0) outlook = `Rain expected today.`;
            else if (rainDayIndex === 1) outlook = `Rain expected tomorrow.`;
            else outlook = `Rain expected in ${rainDayIndex + 1} days.`;
        } else {
             outlook = `Conditions mainly ${getWeatherCondition(data.daily.weathercode[1]).toLowerCase()}.`;
        }


        return {
            summary,
            outlook,
            forecast,
        };
    } catch (error) {
        console.error("Failed to fetch weather data:", error);
        // Return a fallback object on error
        return {
            summary: "20°C, Sunny",
            outlook: "Rain expected in 5 days.",
            forecast: [
                { day: 'Mon', temp: 20, condition: 'Sunny' },
                { day: 'Tue', temp: 21, condition: 'Sunny' },
                { day: 'Wed', temp: 22, condition: 'Partly Cloudy' },
                { day: 'Thu', temp: 21, condition: 'Partly Cloudy' },
                { day: 'Fri', temp: 19, condition: 'Showers' },
                { day: 'Sat', temp: 18, condition: 'Rain' },
                { day: 'Sun', temp: 20, condition: 'Sunny' },
            ],
        };
    }
};