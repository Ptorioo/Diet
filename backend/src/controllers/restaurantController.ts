import { Request, Response } from 'express';
import { pool } from '../utils/db';
import getTravelTimes from '../utils/routeMatrix';
import { fetchWeather, WeatherConditions } from '../utils/weather';

const BAD_WEATHER_KEYWORDS = ['rain', 'snow', 'storm', 'thunder', 'drizzle', 'fog'];
const HOT_WEATHER_CRITERIUM = 30;
const N_BINS = 5;                  // number of bins to apply in the "number of choice"-based penalty
const BAD_WEATHER_PENALTY = 300;   // bad weather travel penalty, 5 minutes
const NO_EATIN_PENALTY = 600;      // no eat-in for bad/hot weathers penalty, 10 minutes
const NUM_CHOICE_PENALTY = 60;    // number of choice penalty, 1 minute per group ranking

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
      is_bad_weather: false,
      is_hot_weather: false
    };
    let isBadWeather = false;
    let isHotWeather = false;

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
        isHotWeather = (weather.feelslike > HOT_WEATHER_CRITERIUM);

        weather = {
          temp: weather.temp ?? 0,
          feelslike: weather.feelslike ?? 0,
          humidity: weather.humidity ?? 0,
          conditions: weather.conditions ?? 'unknown',
          icon: weather.icon ?? 'unknown',
          is_bad_weather: isBadWeather,
          is_hot_weather: isHotWeather
        };

        console.log(`User weather at (${origin.latitude}, ${origin.longitude}): ${weather.conditions}, Bad: ${isBadWeather}. Hot: ${isHotWeather}`);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.warn('Weather fetch failed for user location:', message);
      }

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
                if (isBadWeather) time += BAD_WEATHER_PENALTY;

                const modeKey = `travel_time_${travelMode.toLowerCase()}`;
                restaurants[idx][modeKey] = seconds;
              }
            }
          });
        } catch (err) {
          console.error(`Travel time error for ${travelMode}:`, err);
        }
      }
      
      // COMPUTE TRAFFIC COST
      if (methodList.length > 0) {
        const firstMethod = methodList[0].toString().toLowerCase();
        const sortKey = `travel_time_${firstMethod}`;
        
        // Initialize traffic_cost as travel time for each restaurant
        restaurants.forEach((r: any) => {
          const travelTime = r[sortKey];
          // Initally, traffic cost is travel time of the first travel method
          r.traffic_cost = typeof travelTime === 'number' ? travelTime : Infinity;
        });
        
        // Bin-based "number of choice" penalty
        if (!isBadWeather && !isHotWeather) {
          // Sort a copy by traffic_cost to define bins
          const sortedCopy = [...restaurants].sort((a: any, b: any) => a.traffic_cost - b.traffic_cost);

          const groupSize = Math.ceil(restaurants.length / N_BINS);
          const groupMap = new Map<any, number>(); // restaurant.id -> groupIndex

          sortedCopy.forEach((r, i) => {
            const groupIndex = Math.floor(i / groupSize);
            groupMap.set(r.id, groupIndex);
          });

          // Count how many restaurants are in each group
          const groupCounts: Record<number, number> = {};
          for (const groupIndex of groupMap.values()) {
            groupCounts[groupIndex] = (groupCounts[groupIndex] || 0) + 1;
          }

          // Sort groups by count (smallest first)
          const sortedGroups = Object.entries(groupCounts).sort(([, a], [, b]) => a - b);

          // Assign penalties: smaller group gets higher penalty
          const groupPenalty: Record<number, number> = {};
          sortedGroups.forEach(([groupIdxStr], i) => {
            const groupIdx = Number(groupIdxStr);
            groupPenalty[groupIdx] = NUM_CHOICE_PENALTY * (sortedGroups.length - i);  // largest penalty to smallest group
          });
          
          // Apply group-based penalties
          restaurants.forEach((r: any) => {
            const groupIndex = groupMap.get(r.id);
            if (groupIndex !== undefined && groupPenalty[groupIndex] !== undefined) {
              r.traffic_cost += groupPenalty[groupIndex];
            }
          });
        }

        // No eat-in penalty
        restaurants.forEach((r: any) => {
          // If the weather is hot or it rains, apply penalty to restaurants without eat-in options
          if ((isHotWeather || isBadWeather) && r.eat_in === false) {
            r.traffic_cost += NO_EATIN_PENALTY;
          }
        });
        
        // Sort by traffic_cost
        restaurants = restaurants
          .filter((r: any) => typeof r.traffic_cost === 'number')
          .sort((a: any, b: any) => a.traffic_cost - b.traffic_cost);
      }
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
