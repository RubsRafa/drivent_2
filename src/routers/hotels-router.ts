import { Router } from 'express';
import { getAllHotels, getRoomsByHotelId } from '@/controllers/hotels-controller';
import { authenticateToken } from '@/middlewares';

const hotelsRouter = Router();

hotelsRouter.all('/*', authenticateToken).get('/', getAllHotels).get('/:hotelId', getRoomsByHotelId);
export { hotelsRouter };
