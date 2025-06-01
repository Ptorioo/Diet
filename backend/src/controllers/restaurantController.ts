import { Request, Response } from 'express';
import { pool } from '../utils/db';
import getTravelTimes from '../utils/routeMatrix';
import { fetchWeather, WeatherConditions } from '../utils/weather';

const BAD_WEATHER_KEYWORDS = ['rain', 'snow', 'storm', 'thunder', 'drizzle', 'fog'];

export const getRestaurants = async (req: Request, res: Response) => {
  try {
    const {
      mlabel_id,
      slabel_id,
      eat_in,
      name,
      origin_lat,
      origin_lng,
      method,
    } = req.query;

    let query = `SELECT * FROM restaurant`;
    const values: any[] = [];
    const conditions: string[] = [];

    if (mlabel_id) {
      const mlabelIds = Array.isArray(mlabel_id)
        ? mlabel_id.map(Number)
        : mlabel_id.toString().split(',').map(Number);
      const placeholders = mlabelIds.map((_, i) => `$${values.length + i + 1}`);
      conditions.push(`mlabel_id IN (${placeholders.join(', ')})`);
      values.push(...mlabelIds);
    }

    if (slabel_id) {
      conditions.push(`slabel_id = $${values.length + 1}`);
      values.push(Number(slabel_id));
    }

    if (eat_in !== undefined) {
      conditions.push(`eat_in = $${values.length + 1}`);
      values.push(eat_in === 'true');
    }

    if (name) {
      conditions.push(`name ILIKE $${values.length + 1}`);
      values.push(`%${name}%`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(' AND ');
    }

    const dbResult = await pool.query(query, values);
    let restaurants = dbResult.rows;

    let weather: WeatherConditions = {
      temp: 0,
      feelslike: 0,
      humidity: 0,
      conditions: 'unknown',
      icon: 'unknown',
    };
    let isBadWeather = false;

    if (origin_lat && origin_lng) {
      const origin = {
        latitude: parseFloat(origin_lat as string),
        longitude: parseFloat(origin_lng as string),
      };

      const destinations = restaurants
        .filter((r: any) => r.latitude && r.longitude)
        .map((r: any) => ({
          latitude: parseFloat(r.latitude),
          longitude: parseFloat(r.longitude),
        }));

      // Allow multi-methods
      const methodList = method
        ? Array.isArray(method)
          ? method
          : method.toString().split(',')
        : ['TRANSIT'];

      const validMethods = ['WALK', 'DRIVE', 'BICYCLE', 'TRANSIT'];

      try {
        weather = await fetchWeather(origin.latitude, origin.longitude);
        isBadWeather = BAD_WEATHER_KEYWORDS.some(k =>
          weather.conditions?.toLowerCase().includes(k)
        );

        weather = {
          temp: weather.temp ?? 0,
          feelslike: weather.feelslike ?? 0,
          humidity: weather.humidity ?? 0,
          conditions: weather.conditions ?? 'unknown',
          icon: weather.icon ?? 'unknown',
        };

        console.log(`User weather at (${origin.latitude}, ${origin.longitude}): ${weather.conditions}, Bad: ${isBadWeather}`);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.warn('Weather fetch failed for user location:', message);
      }

      // Initialize travel_times per restaurant
      restaurants.forEach((r: any) => {
        r.travel_times = {};
        r.weather = weather;
        r.weather_penalty_applied = isBadWeather;
      });

      for (const methodRaw of methodList) {
        const travelMode = methodRaw.toString().toUpperCase();
        if (!validMethods.includes(travelMode)) continue;

        try {
          const travelData = await getTravelTimes(origin, destinations, travelMode as any);
          console.log(`Travel data for ${travelMode}:`, travelData);

          travelData.forEach((td: any) => {
            const idx = td.destinationIndex;
            if (
              typeof idx === 'number' &&
              td.duration &&
              restaurants[idx]
            ) {
              const durationMatch = td.duration.match(/\d+/);
              const seconds = durationMatch ? parseInt(durationMatch[0], 10) : null;

              if (seconds !== null) {
                let time = seconds;
                if (isBadWeather) time += 600; // 10-minute penalty

                restaurants[idx].travel_times[travelMode.toLowerCase()] = time;
              }
            }
          });
        } catch (err) {
          console.error(`Travel time error for ${travelMode}:`, err);
        }
      }

      // Sort by shortest time across all methods
      // restaurants = restaurants
      //     .filter((r: any) => typeof r.travel_time_seconds === 'number')
      //     .sort((a: any, b: any) => a.travel_time_seconds - b.travel_time_seconds);
    };

    res.json({
      weather,
      restaurants,
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
