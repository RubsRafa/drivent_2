import { jest } from '@jest/globals';
import { TicketStatus } from '@prisma/client';
import { returnEnrollmentWithAddress, returnTicketWithType } from '../factories';
import { returnBooking, returnBookingWithRoom, returnRoom } from '../factories/room-factory';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import bookingService from '@/services/booking-service';
import roomRepository from '@/repositories/room-repository';
import bookingRepository from '@/repositories/booking-repository';

describe('bookingService test suite', () => {
  // describe('checkEnrollmentTicket function', () => {
  //     it('should check enrollment ticket', async () => {
  //         jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
  //             return returnEnrollmentWithAddress();
  //         });

  //         jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
  //             return returnTicketWithType(false, true, TicketStatus.PAID);
  //         });

  //         await bookingService.checkEnrollmentTicket(1);

  //         expect(enrollmentRepository.findWithAddressByUserId).toBeCalled();
  //         expect(ticketsRepository.findTicketByEnrollmentId).toBeCalled();
  //     });
  //     it('should not check enrollment ticket if enrollment does not exist', async () => {
  //         jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
  //             return false;
  //         });

  //         const response = bookingService.checkEnrollmentTicket(1);

  //         expect(enrollmentRepository.findWithAddressByUserId).toBeCalled();
  //         expect(response).rejects.toStrictEqual({
  //             name: 'CannotBookingError',
  //             message: 'Cannot booking this room! Overcapacity!',
  //         });
  //     });
  //     it('should not check enrollment ticket if ticket does not exist', async () => {
  //         jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
  //             return returnEnrollmentWithAddress();
  //         });

  //         jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
  //             return undefined;
  //         });

  //         const response = bookingService.bookingRoomById(1, 1);

  //         expect(enrollmentRepository.findWithAddressByUserId).toBeCalled();
  //         expect(response).rejects.toStrictEqual({
  //             name: 'CannotBookingError',
  //             message: 'Cannot booking this room! Overcapacity!',
  //         });
  //     });
  //     it('should not check enrollment ticket if ticket is RESERVED', async () => {
  //         jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
  //             return returnEnrollmentWithAddress();
  //         });

  //         jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
  //             return returnTicketWithType(false, true, TicketStatus.RESERVED);
  //         });

  //         const response = bookingService.bookingRoomById(1, 1);

  //         expect(enrollmentRepository.findWithAddressByUserId).toBeCalled();
  //         expect(response).rejects.toStrictEqual({
  //             name: 'CannotBookingError',
  //             message: 'Cannot booking this room! Overcapacity!',
  //         });
  //     });
  //     it('should not check enrollment ticket if ticket is remote', async () => {
  //         jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
  //             return returnEnrollmentWithAddress();
  //         });

  //         jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
  //             return returnTicketWithType(true, true, TicketStatus.PAID);
  //         });

  //         const response = bookingService.bookingRoomById(1, 1);

  //         expect(enrollmentRepository.findWithAddressByUserId).toBeCalled();
  //         expect(response).rejects.toStrictEqual({
  //             name: 'CannotBookingError',
  //             message: 'Cannot booking this room! Overcapacity!',
  //         });
  //     });
  //     it('should not check enrollment ticket if ticket does not includes hotel', async () => {
  //         jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
  //             return returnEnrollmentWithAddress();
  //         });

  //         jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
  //             return returnTicketWithType(false, false, TicketStatus.PAID);
  //         });

  //         const response = bookingService.bookingRoomById(1, 1);

  //         expect(enrollmentRepository.findWithAddressByUserId).toBeCalled();
  //         expect(response).rejects.toStrictEqual({
  //             name: 'CannotBookingError',
  //             message: 'Cannot booking this room! Overcapacity!',
  //         });
  //     });
  // });
  // describe('checkValidBooking function', () => {
  //     it('should check valid booking', async () => {
  //         jest.spyOn(roomRepository, 'findById').mockImplementationOnce((): any => {
  //             return returnRoom(2);
  //         });

  //         jest.spyOn(bookingRepository, 'findByRoomId').mockImplementationOnce((): any => {
  //             return returnBookingWithRoom();
  //         });

  //         await bookingService.checkValidBooking(1);
  //         expect(roomRepository.findById).toBeCalled();
  //         expect(bookingRepository.findByRoomId).toBeCalled();
  //     });
  //     it('should not check valid booking if room does not exist', async () => {
  //         jest.spyOn(roomRepository, 'findById').mockImplementationOnce((): any => {
  //             return false;
  //         });

  //         jest.spyOn(bookingRepository, 'findByRoomId').mockImplementationOnce((): any => {
  //             return returnBookingWithRoom();
  //         });

  //         const response = bookingService.checkValidBooking(1);

  //         expect(response).rejects.toStrictEqual({
  //             name: 'NotFoundError',
  //             message: 'No result for this search!',
  //         });
  //     });
  //     it('should not check valid booking if room has no capacity', async () => {
  //         jest.spyOn(roomRepository, 'findById').mockImplementationOnce((): any => {
  //             return returnRoom(1);
  //         });

  //         jest.spyOn(bookingRepository, 'findByRoomId').mockImplementationOnce((): any => {
  //             return [returnBookingWithRoom(), returnBookingWithRoom()];
  //         });

  //         const response = bookingService.checkValidBooking(1);

  //         expect(roomRepository.findById).toBeCalled();
  //         expect(response).rejects.toStrictEqual({
  //             name: 'CannotBookingError',
  //             message: 'Cannot booking this room! Overcapacity!',
  //         });
  //     });
  // });
  // describe('getBooking function', () => {
  //     it('should get booking', async () => {
  //         const booking = returnBookingWithRoom();
  //         jest.spyOn(bookingRepository, 'findByUserId').mockImplementationOnce((): any => {
  //             return booking;
  //         });

  //         const response = await bookingService.getBooking(1);
  //         expect(response).toBe(booking);
  //         expect(bookingRepository.findByUserId).toBeCalled();
  //     });
  //     it('should not get booking if booking does not exist', async () => {
  //         jest.spyOn(bookingRepository, 'findByUserId').mockImplementationOnce((): any => {
  //             return null;
  //         });

  //         const response = bookingService.getBooking(1);
  //         expect(response).rejects.toStrictEqual({
  //             name: 'NotFoundError',
  //             message: 'No result for this search!',
  //         });
  //         expect(bookingRepository.findByUserId).toBeCalled();
  //     });
  // });
  // describe('bookingRoomById function', () => {
  //     it('should book by room id', async () => {
  //         const booking = returnBooking();

  //         jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
  //             return returnEnrollmentWithAddress();
  //         });
  //         jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
  //             return returnTicketWithType(false, true, TicketStatus.PAID);
  //         });
  //         jest.spyOn(roomRepository, 'findById').mockImplementationOnce((): any => {
  //             return returnRoom(2);
  //         });
  //         jest.spyOn(bookingRepository, 'findByRoomId').mockImplementationOnce((): any => {
  //             return returnBookingWithRoom();
  //         });
  //         jest.spyOn(bookingRepository, 'create').mockImplementationOnce((): any => {
  //             return booking;
  //         });

  //         const response = await bookingService.bookingRoomById(1,1);
  //         expect(response).toBe(booking);
  //     });
  //     it('should not book if roomId does not exist', async () => {

  //         const response = bookingService.bookingRoomById(1, null);
  //         expect(response).rejects.toStrictEqual({
  //             name: 'BadRequestError',
  //             message: 'Bad Request Error!',
  //           });
  //     });
  // });
  describe('changeBookingRoomById function', () => {
    it('should change booking room by id', async () => {
      const booking = returnBookingWithRoom();
      jest.spyOn(roomRepository, 'findById').mockImplementationOnce((): any => {
        return returnRoom(2);
      });

      jest.spyOn(bookingRepository, 'findByRoomId').mockImplementationOnce((): any => {
        return returnBookingWithRoom();
      });

      jest.spyOn(bookingRepository, 'findByUserId').mockImplementationOnce((): any => {
        return booking;
      });
      jest.spyOn(bookingRepository, 'upsertBooking').mockImplementationOnce((): any => {
        return booking;
      });

      const response = await bookingService.changeBookingRoomById(booking.userId, booking.roomId);

      expect(response).toBe(booking);
      expect(bookingRepository.findByUserId).toBeCalled();
      expect(bookingRepository.upsertBooking).toBeCalled();
    });
    it('should not change booking if roomId does not exist', async () => {
      const response = bookingService.changeBookingRoomById(1, undefined);

      expect(response).rejects.toStrictEqual({
        name: 'BadRequestError',
        message: 'Bad Request Error!',
      });
    });
    it('should not change booking if booking does not exist', async () => {
      const booking = returnBookingWithRoom();
      jest.spyOn(roomRepository, 'findById').mockImplementationOnce((): any => {
        return returnRoom(2);
      });

      jest.spyOn(bookingRepository, 'findByRoomId').mockImplementationOnce((): any => {
        return returnBookingWithRoom();
      });

      jest.spyOn(bookingRepository, 'findByUserId').mockImplementationOnce((): any => {
        return undefined;
      });

      const response = bookingService.changeBookingRoomById(booking.userId, booking.roomId);

      expect(response).rejects.toStrictEqual({
        name: 'CannotBookingError',
        message: 'Cannot booking this room! Overcapacity!',
      });
    });
    it('should not change booking if booking is not from user', async () => {
      const booking = returnBookingWithRoom();
      jest.spyOn(roomRepository, 'findById').mockImplementationOnce((): any => {
        return returnRoom(2);
      });

      jest.spyOn(bookingRepository, 'findByRoomId').mockImplementationOnce((): any => {
        return returnBookingWithRoom();
      });

      jest.spyOn(bookingRepository, 'findByUserId').mockImplementationOnce((): any => {
        return booking;
      });

      const response = bookingService.changeBookingRoomById(booking.userId + 1, booking.roomId);

      expect(response).rejects.toStrictEqual({
        name: 'CannotBookingError',
        message: 'Cannot booking this room! Overcapacity!',
      });
    });
  });
});
