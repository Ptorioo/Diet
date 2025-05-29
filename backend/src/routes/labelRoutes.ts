import { Router } from 'express';
import { getMainLabels } from '../controllers/labelController';

const router = Router();

router.get('/', getMainLabels);

export default router;
