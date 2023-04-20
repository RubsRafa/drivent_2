import { Router } from 'express';
import { getAllHotels } from '@/controllers/hotels-controller';

const hotelsRouter = Router();

hotelsRouter.get('/', getAllHotels).get('/:hotelId');
export { hotelsRouter };
