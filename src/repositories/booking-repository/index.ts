import { Booking, Room } from '@prisma/client';
import { prisma } from '@/config';

async function findBookingByUserId(userId: number): Promise<Booking & { Room: Room }> {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    include: {
      Room: true,
    },
  });
}

async function findBookingByRoomId(roomId: number): Promise<(Booking & { Room: Room })[]> {
  return prisma.booking.findMany({
    where: {
      roomId,
    },
    include: {
      Room: true,
    },
  });
}

async function findRoom(roomId: number): Promise<Room> {
  return prisma.room.findUnique({
    where: {
      id: roomId,
    },
  });
}

async function createBooking(userId: number, roomId: number): Promise<Booking> {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

async function updateBooking(id: number, roomId: number): Promise<Booking> {
  return prisma.booking.update({
    where: {
      id,
    },
    data: {
      roomId,
    },
  });
}

const bookingRepository = {
  findBookingByUserId,
  findBookingByRoomId,
  findRoom,
  createBooking,
  updateBooking,
};

export default bookingRepository;
