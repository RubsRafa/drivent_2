import { Response } from 'express';
import httpStatus from 'http-status';
import { Hotel } from '@prisma/client';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';

export async function getAllHotels(req: AuthenticatedRequest, res: Response) {
  // const { userId } = req;
  try {
    const hotels: Hotel[] = await hotelsService.getAllHotels();
    return res.status(httpStatus.OK).send(hotels);
  } catch (e) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
