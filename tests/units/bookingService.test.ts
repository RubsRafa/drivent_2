import { jest } from '@jest/globals';
import { TicketStatus } from '@prisma/client';
import { returnEnrollmentWithAddress, returnTicketWithType } from '../factories';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import bookingService from '@/services/booking-service';
import roomRepository from '@/repositories/room-repository';

describe('bookingService test suite', () => {
  describe('checkEnrollmentTicket function', () => {
    it('should check enrollment ticket', async () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return returnEnrollmentWithAddress();
      });

      jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
        return returnTicketWithType(false, true, TicketStatus.PAID);
      });

      await bookingService.checkEnrollmentTicket(1);

      expect(enrollmentRepository.findWithAddressByUserId).toBeCalled();
      expect(ticketsRepository.findTicketByEnrollmentId).toBeCalled();
    });
    it('should not check enrollment ticket if enrollment does not exist', async () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return false;
      });

      const response = bookingService.checkEnrollmentTicket(1);

      expect(enrollmentRepository.findWithAddressByUserId).toBeCalled();
      expect(response).rejects.toStrictEqual({
        name: 'CannotBookingError',
        message: 'Cannot booking this room! Overcapacity!',
      });
    });
    it('should not check enrollment ticket if ticket does not exist', async () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return returnEnrollmentWithAddress();
      });

      jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
        return undefined;
      });

      const response = bookingService.bookingRoomById(1, 1);

      expect(enrollmentRepository.findWithAddressByUserId).toBeCalled();
      expect(response).rejects.toStrictEqual({
        name: 'CannotBookingError',
        message: 'Cannot booking this room! Overcapacity!',
      });
    });
    it('should not check enrollment ticket if ticket is RESERVED', async () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return returnEnrollmentWithAddress();
      });

      jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
        return returnTicketWithType(false, true, TicketStatus.RESERVED);
      });

      const response = bookingService.bookingRoomById(1, 1);

      expect(enrollmentRepository.findWithAddressByUserId).toBeCalled();
      expect(response).rejects.toStrictEqual({
        name: 'CannotBookingError',
        message: 'Cannot booking this room! Overcapacity!',
      });
    });
    it('should not check enrollment ticket if ticket is remote', async () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return returnEnrollmentWithAddress();
      });

      jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
        return returnTicketWithType(true, true, TicketStatus.PAID);
      });

      const response = bookingService.bookingRoomById(1, 1);

      expect(enrollmentRepository.findWithAddressByUserId).toBeCalled();
      expect(response).rejects.toStrictEqual({
        name: 'CannotBookingError',
        message: 'Cannot booking this room! Overcapacity!',
      });
    });
    it('should not check enrollment ticket if ticket does not includes hotel', async () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return returnEnrollmentWithAddress();
      });

      jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
        return returnTicketWithType(false, false, TicketStatus.PAID);
      });

      const response = bookingService.bookingRoomById(1, 1);

      expect(enrollmentRepository.findWithAddressByUserId).toBeCalled();
      expect(response).rejects.toStrictEqual({
        name: 'CannotBookingError',
        message: 'Cannot booking this room! Overcapacity!',
      });
    });
  });
  // describe('checkValidBooking function', () => {
  //     it('should check valid booking', async () => {
  //         jest.spyOn(roomRepository, 'findById').mockImplementationOnce((): any => {
  //             return returnEnrollmentWithAddress();
  //         });
  //     })
  // })
});
