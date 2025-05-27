import { Request, Response } from 'express';

let preferenceStore: Record<string, any> = {};

export const savePreferences = (req: Request, res: Response) => {
  const { userId, preferences } = req.body;
  preferenceStore[userId] = preferences;

  res.status(200).json({ message: 'Preferences saved', preferences });
};
