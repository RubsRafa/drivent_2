import { Hotel, Room } from '@prisma/client';
import hotelsRepository from '@/repositories/hotels-repository';
import { notFoundError, paymentRequiredError } from '@/errors';
import paymentsRepository from '@/repositories/payments-repository';

async function getAllHotels(): Promise<Hotel[]> {
  const hotels: Hotel[] = await hotelsRepository.findAllHotels();
  return hotels;
}

async function getRoomsByHotelId(userId: number, hotelId: number): Promise<Hotel & { Rooms: Room[] }> {
  const userHasEnrollment = await hotelsRepository.findEnrollmentByUserId(userId);
  if (!userHasEnrollment) throw notFoundError();

  const userHasTicket = await hotelsRepository.findTicketByEnrollmentId(userHasEnrollment.id);
  if (!userHasTicket) throw notFoundError();

  const ticketTypeHasHotel = await hotelsRepository.findTypeByTicketId(userHasTicket.ticketTypeId);
  if (!ticketTypeHasHotel.includesHotel) throw notFoundError();

  const userHasPayed = await paymentsRepository.findPaymentByTicketId(userHasTicket.id);
  if (!userHasPayed) throw paymentRequiredError('This user has not payed this ticket yet');
  if (ticketTypeHasHotel.isRemote || !ticketTypeHasHotel.includesHotel)
    throw paymentRequiredError(
      'This event is remote or does not include a hotel, so it is not possible to book accommodation',
    );

  const hotel = await hotelsRepository.findHotelById(hotelId);
  return hotel;
}

export default { getAllHotels, getRoomsByHotelId };
