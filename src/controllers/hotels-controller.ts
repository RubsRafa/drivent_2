import { Response } from 'express';
import httpStatus from 'http-status';
import { Hotel } from '@prisma/client';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';

export async function getAllHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const hotels: Hotel[] = await hotelsService.getAllHotels(userId);
    return res.status(httpStatus.OK).send(hotels);
  } catch (e) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getRoomsByHotelId(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const hotelId = Number(req.query.hotelId);

  try {
    if (!hotelId) return res.sendStatus(httpStatus.BAD_REQUEST);
    const hotelRooms = await hotelsService.getRoomsByHotelId(userId, hotelId);
    return res.status(httpStatus.OK).send(hotelRooms);
  } catch (e) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
