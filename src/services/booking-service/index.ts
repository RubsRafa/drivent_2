import { TicketStatus } from '@prisma/client';
import { notFoundError } from '@/errors';
import { forbiddenError } from '@/errors/forbidden-error';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function listBooking(userId: number) {
  const booking = await bookingRepository.findBookingByUserId(userId);
  if (!booking) throw notFoundError();

  return booking;
}

async function postBooking(userId: number, roomId: number) {
  if (!roomId) throw notFoundError();

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();
  if (ticket.status === TicketStatus.PAID || !ticket.TicketType.isRemote || ticket.TicketType.includesHotel)
    throw forbiddenError('Your ticket is remote, does not include hotel or is not paid yet');

  const room = await bookingRepository.findRoom(roomId);
  if (!room) throw notFoundError();

  const allBookings = await bookingRepository.findBookingByRoomId(roomId);
  if (allBookings.length + 1 === room.capacity) throw forbiddenError('This room is already full');

  const booking = await bookingRepository.createBooking(userId, roomId);
  return booking.id;
}

export default {
  listBooking,
  postBooking,
};
