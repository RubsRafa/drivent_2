import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { Hotel } from '@prisma/client';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';

export async function getAllHotels(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  try {
    const hotels: Hotel[] = await hotelsService.getAllHotels(userId);
    return res.status(httpStatus.OK).send(hotels);
  } catch (e) {
    next(e);
  }
}

export async function getRoomsByHotelId(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const hotelId = Number(req.params.hotelId);

  try {
    if (!hotelId) return res.sendStatus(httpStatus.BAD_REQUEST);
    const hotelRooms = await hotelsService.getRoomsByHotelId(userId, hotelId);
    return res.status(httpStatus.OK).send(hotelRooms);
  } catch (e) {
    next(e);
  }
}
