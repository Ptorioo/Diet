import { Request, Response } from 'express';
import { pool } from '../utils/db';

export const getMainLabels = async (req: Request, res: Response) => {
  try {
    const { cuisine, budget } = req.query;

    let query = `SELECT * FROM main_label`;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching main labels:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
