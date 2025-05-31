export async function fetchWeather(lat: string, lng: string): Promise<string> {
    const apiKey =
      process.env.VISUALCROSSING_API_KEY;
  
    if (!apiKey) throw new Error('Missing Visual Crossing API key');
  
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(
      lat
    )},${encodeURIComponent(
      lng
    )}/today?unitGroup=metric&include=current,days&key=${apiKey}&contentType=json`;
  
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Failed to fetch weather: ${res.statusText}`);
    }
  
    const data = await res.json();
  
    const conditions =
      data.currentConditions?.conditions || data.days?.[0]?.conditions;
  
    if (!conditions) {
      throw new Error('No weather conditions found in API response');
    }
  
    return conditions;
  }
  