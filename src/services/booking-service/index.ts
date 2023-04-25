import { notFoundError } from '@/errors';
import bookingRepository from '@/repositories/booking-repository';

async function listBooking(userId: number) {
  const booking = await bookingRepository.findBooking(userId);
  if (!booking) throw notFoundError();

  return booking;
}

export default {
  listBooking,
};
