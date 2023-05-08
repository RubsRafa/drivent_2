import { jest } from '@jest/globals';
import { TicketStatus } from '@prisma/client';
import { returnEnrollmentWithAddress, returnHotel, returnHotelWithRoom, returnTicketWithType } from '../factories';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import hotelsService from '@/services/hotels-service';
import hotelRepository from '@/repositories/hotel-repository';

describe('hotelsService test suite', () => {
  describe('listHotels', () => {
    it('should list hotels', async () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return returnEnrollmentWithAddress();
      });
      jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
        return returnTicketWithType(false, true, TicketStatus.PAID);
      });

      await hotelsService.listHotels(1);
      expect(enrollmentRepository.findWithAddressByUserId).toBeCalled();
      expect(ticketsRepository.findTicketByEnrollmentId).toBeCalled();
    });
    it('should not list hotels if enrollment does not exist', async () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return undefined;
      });

      const response = hotelsService.listHotels(1);
      expect(response).rejects.toStrictEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });
    it('should not list hotels if ticket does not exist', async () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return returnEnrollmentWithAddress();
      });
      jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
        return undefined;
      });

      const response = hotelsService.listHotels(1);
      expect(response).rejects.toStrictEqual({
        name: 'CannotListHotelsError',
        message: 'Cannot list hotels!',
      });
    });
    it('should not list hotels if ticket is RESERVED', async () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return returnEnrollmentWithAddress();
      });
      jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
        return returnTicketWithType(false, true, TicketStatus.RESERVED);
      });

      const response = hotelsService.listHotels(1);
      expect(response).rejects.toStrictEqual({
        name: 'CannotListHotelsError',
        message: 'Cannot list hotels!',
      });
    });
    it('should not list hotels if ticket is remote', async () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return returnEnrollmentWithAddress();
      });
      jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
        return returnTicketWithType(true, true, TicketStatus.PAID);
      });

      const response = hotelsService.listHotels(1);
      expect(response).rejects.toStrictEqual({
        name: 'CannotListHotelsError',
        message: 'Cannot list hotels!',
      });
    });
    it('should not list hotels if ticket does not includes hotel', async () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return returnEnrollmentWithAddress();
      });
      jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
        return returnTicketWithType(false, false, TicketStatus.PAID);
      });

      const response = hotelsService.listHotels(1);
      expect(response).rejects.toStrictEqual({
        name: 'CannotListHotelsError',
        message: 'Cannot list hotels!',
      });
    });
  });
  describe('getHotels', () => {
    it('should get hotels', async () => {
      const hotels = [returnHotel()];
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return returnEnrollmentWithAddress();
      });
      jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
        return returnTicketWithType(false, true, TicketStatus.PAID);
      });
      jest.spyOn(hotelRepository, 'findHotels').mockImplementationOnce((): any => {
        return hotels;
      });

      const response = await hotelsService.getHotels(1);
      expect(response).toBe(hotels);
    });
    it('should not get hotels if no hotels exists', async () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return returnEnrollmentWithAddress();
      });
      jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
        return returnTicketWithType(false, true, TicketStatus.PAID);
      });
      jest.spyOn(hotelRepository, 'findHotels').mockImplementationOnce((): any => {
        return undefined;
      });

      const response = hotelsService.getHotels(1);
      expect(response).rejects.toStrictEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });
  });
  describe('getHotelsWithRooms', () => {
    it('should get hotels with rooms', async () => {
      const hotel = await returnHotelWithRoom();
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return returnEnrollmentWithAddress();
      });
      jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
        return returnTicketWithType(false, true, TicketStatus.PAID);
      });
      jest.spyOn(hotelRepository, 'findRoomsByHotelId').mockImplementationOnce((): any => {
        return hotel;
      });

      const response = await hotelsService.getHotelsWithRooms(1, hotel.id);
      expect(response).toBe(hotel);
    });
    it('should not get hotels with rooms if no hotel exist', async () => {
      const hotel = await returnHotelWithRoom();
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return returnEnrollmentWithAddress();
      });
      jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
        return returnTicketWithType(false, true, TicketStatus.PAID);
      });
      jest.spyOn(hotelRepository, 'findRoomsByHotelId').mockImplementationOnce((): any => {
        return undefined;
      });

      const response = hotelsService.getHotelsWithRooms(1, hotel.id);
      expect(response).rejects.toStrictEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });
  });
});
