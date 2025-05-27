import { Router } from 'express';
import { savePreferences } from '../controllers/preferenceController';

const router = Router();

router.post('/', savePreferences);

export default router;
