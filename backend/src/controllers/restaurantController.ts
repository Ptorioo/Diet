import { Request, Response } from 'express';
import { pool } from '../utils/db';
import getTravelTimes from '../utils/routeMatrix';

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
      conditions.push(`mlabel_id = $${values.length + 1}`);
      values.push(Number(mlabel_id));
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

    // If travel time is requested
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

      try {
        const travelData = await getTravelTimes(origin, destinations, travelMode);
        console.log('Travel data:', travelData);

        // Attach travel time to the corresponding restaurant using destinationIndex
        travelData.forEach((td: any) => {
          const idx = td.destinationIndex;
          if (
            typeof idx === 'number' &&
            td.duration &&
            restaurants[idx] // make sure index exists
          ) {
            const seconds = parseInt(td.duration.replace('s', ''), 10);
            restaurants[idx].travel_time_seconds = seconds;
          }
        });

        // Filter out any without valid travel time and sort
        restaurants = restaurants
          .filter((r: any) => typeof r.travel_time_seconds === 'number')
          .sort((a: any, b: any) => a.travel_time_seconds - b.travel_time_seconds);
      } catch (err) {
        console.error('Travel time error:', err);
        // Continue without travel time if the API fails
      }
    }

    res.json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
