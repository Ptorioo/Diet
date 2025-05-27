import { Router } from 'express';
import { getRestaurants } from '../controllers/restaurantController';

const router = Router();

router.get('/', getRestaurants);

export default router;
