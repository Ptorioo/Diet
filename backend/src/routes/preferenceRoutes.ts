import { Router } from 'express';
import { getPreferences } from '../controllers/preferenceController';

const router = Router();

router.get('/', getPreferences);

export default router;
