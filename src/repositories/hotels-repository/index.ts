import { Hotel, Room } from '@prisma/client';
import { prisma } from '@/config';

async function findAllHotels(): Promise<Hotel[]> {
  return prisma.hotel.findMany();
}

async function findEnrollmentByUserId(userId: number) {
  return prisma.enrollment.findUnique({
    where: {
      userId,
    },
  });
}

async function findTicketByEnrollmentId(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: {
      enrollmentId,
    },
  });
}

async function findTypeByTicketId(id: number) {
  return prisma.ticketType.findUnique({
    where: {
      id,
    },
  });
}

async function findHotelById(hotelId: number): Promise<Hotel & { Rooms: Room[] }> {
  return prisma.hotel.findUnique({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });
}

export default {
  findAllHotels,
  findEnrollmentByUserId,
  findTicketByEnrollmentId,
  findTypeByTicketId,
  findHotelById,
};
