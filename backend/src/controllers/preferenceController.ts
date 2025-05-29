import { Request, Response } from 'express';
import { pool } from '../utils/db';

export const getPreferences = async (req: Request, res: Response) => {
  try {
    const { cuisine, budget } = req.query;

    let query = `SELECT * FROM restaurant_preferences_mock`;
    const values: any[] = [];

    const conditions: string[] = [];

    if (cuisine) {
      conditions.push(`type = $${values.length + 1}`);
      values.push(cuisine);
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(' AND ');
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
