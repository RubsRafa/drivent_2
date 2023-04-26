import { TicketStatus } from '@prisma/client';
import { notFoundError } from '@/errors';
import { forbiddenError } from '@/errors/forbidden-error';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import { BookingInfo } from '@/protocols';

async function verifyInfo(userId: number, roomId: number): Promise<void> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();
  if (ticket.status !== TicketStatus.PAID || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel)
    throw forbiddenError('Your ticket is remote, does not include hotel or is not paid yet');

  if (!roomId) throw notFoundError();

  const room = await bookingRepository.findRoom(roomId);

  if (!room) throw notFoundError();

  const allBookings = await bookingRepository.findBookingByRoomId(roomId);
  if (allBookings.length + 1 >= room.capacity) throw forbiddenError('This room is already full');

  return;
}

async function listBooking(userId: number): Promise<BookingInfo> {
  const booking = await bookingRepository.findBookingByUserId(userId);
  if (!booking) throw notFoundError();

  const myBooking: BookingInfo = {
    id: booking.id,
    Room: {
      id: booking.Room.id,
      name: booking.Room.name,
      capacity: booking.Room.capacity,
      hotelId: booking.Room.hotelId,
      createdAt: booking.Room.createdAt,
      updatedAt: booking.Room.updatedAt,
    },
  };

  return myBooking;
}

async function postBooking(userId: number, roomId: number): Promise<number> {
  await verifyInfo(userId, roomId);

  const booking = await bookingRepository.createBooking(userId, roomId);
  return booking.id;
}

async function putBooking(userId: number, roomId: number): Promise<number> {
  await verifyInfo(userId, roomId);

  const booking = await bookingRepository.findBookingByUserId(userId);
  if (!booking) throw forbiddenError('This user has no reservations');
  await bookingRepository.updateBooking(booking.id);

  return booking.id;
}

export default {
  listBooking,
  postBooking,
  putBooking,
};
