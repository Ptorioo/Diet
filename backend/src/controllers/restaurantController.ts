import { Request, Response } from 'express';
import { pool } from '../utils/db';
import getTravelTimes from '../utils/routeMatrix';
import { fetchWeather } from '../utils/weather';

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

      const travelMode = (method?.toString().toUpperCase() || 'TRANSIT') as
        | 'WALK'
        | 'DRIVE'
        | 'BICYCLE'
        | 'TRANSIT';

      let isBadWeather = false;
      let weather = '';

      try {
        // Fetch weather for user's location
        weather = await fetchWeather(origin.latitude, origin.longitude);
        isBadWeather = BAD_WEATHER_KEYWORDS.some(k =>
          weather.toLowerCase().includes(k)
        );

        console.log(`User weather at (${origin.latitude}, ${origin.longitude}): ${weather}, Bad: ${isBadWeather}`);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.warn('Weather fetch failed for user location:', message);
      }

      try {
        const travelData = await getTravelTimes(origin, destinations, travelMode);
        console.log('Travel data:', travelData);

        travelData.forEach((td: any) => {
          const idx = td.destinationIndex;
          if (
            typeof idx === 'number' &&
            td.duration &&
            restaurants[idx]
          ) {
            const seconds = parseInt(td.duration.replace('s', ''), 10);
            restaurants[idx].travel_time_seconds = seconds;
            restaurants[idx].weather = weather;

            if (isBadWeather) {
              restaurants[idx].travel_time_seconds += 600; // Apply penalty globally
              restaurants[idx].weather_penalty_applied = true;
            }
          }
        });

        restaurants = restaurants
          .filter((r: any) => typeof r.travel_time_seconds === 'number')
          .sort((a: any, b: any) => a.travel_time_seconds - b.travel_time_seconds);
      } catch (err) {
        console.error('Travel time error:', err);
      }
    }

    res.json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
