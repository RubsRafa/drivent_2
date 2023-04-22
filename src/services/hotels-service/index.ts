import { Enrollment, Hotel, Payment, Room, Ticket, TicketStatus, TicketType } from '@prisma/client';
import hotelsRepository from '@/repositories/hotels-repository';
import { notFoundError, paymentRequiredError } from '@/errors';
import paymentsRepository from '@/repositories/payments-repository';

async function verifyIfUserHas(userId: number) {
  const userHasEnrollment: Enrollment = await hotelsRepository.findEnrollmentByUserId(userId);

  if (!userHasEnrollment) throw notFoundError();

  const userHasTicket: Ticket = await hotelsRepository.findTicketByEnrollmentId(userHasEnrollment.id);

  if (!userHasTicket) throw notFoundError();

  if (userHasTicket.status === TicketStatus.RESERVED)
    throw paymentRequiredError('This user has not payed this ticket yet');

  const ticketTypeHasHotel: TicketType = await hotelsRepository.findTypeByTicketId(userHasTicket.ticketTypeId);
  if (ticketTypeHasHotel.isRemote === true)
    throw paymentRequiredError('This event is remote, so it is not possible to book accommodation');

  if (ticketTypeHasHotel.includesHotel === false)
    throw paymentRequiredError('This event does not include a hotel, so it is not possible to book accommodation');

  const userHasPayed: Payment = await paymentsRepository.findPaymentByTicketId(userHasTicket.id);

  if (!userHasPayed) throw paymentRequiredError('This user has not payed this ticket yet');

  return;
}

async function getAllHotels(userId: number): Promise<Hotel[]> {
  await verifyIfUserHas(userId);

  const hotels: Hotel[] = await hotelsRepository.findAllHotels();

  if (hotels[0] === null || hotels[0] === undefined || !hotels[0]) throw notFoundError();
  return hotels;
}

async function getRoomsByHotelId(userId: number, hotelId: number): Promise<Hotel & { Rooms: Room[] }> {
  await verifyIfUserHas(userId);

  const hotel: Hotel & { Rooms: Room[] } = await hotelsRepository.findHotelById(hotelId);

  if (hotel === null || hotel === undefined || !hotel) throw notFoundError();
  return hotel;
}

export default { getAllHotels, getRoomsByHotelId };
