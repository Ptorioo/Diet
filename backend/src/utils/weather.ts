export interface WeatherConditions {
    temp: number;
    feelslike: number;
    humidity: number;
    conditions: string;
    icon: string;
    is_bad_weather: boolean;
    is_hot_weather: boolean;
}

export async function fetchWeather(
    lat: number,
    lng: number
): Promise<WeatherConditions> {
    const apiKey = process.env.VISUALCROSSING_API_KEY;

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
    console.log(data);

    const currentConditions = data.currentConditions;

    if (!currentConditions) {
        throw new Error('No current weather conditions found in API response');
    }

    return currentConditions;
}
