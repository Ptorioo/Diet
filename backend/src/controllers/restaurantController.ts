import { Request, Response } from 'express';
import { pool } from '../utils/db';

export const getRestaurants = async (req: Request, res: Response) => {
  try {
    const { mlabel_id, slabel_id, eat_in, name } = req.query;

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

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
