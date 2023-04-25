import { prisma } from '@/config';

async function findBookingByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    include: {
      Room: true,
    },
  });
}

async function findBookingByRoomId(roomId: number) {
  return prisma.booking.findMany({
    where: {
      roomId,
    },
    include: {
      Room: true,
    },
  });
}

async function findRoom(roomId: number) {
  return prisma.room.findUnique({
    where: {
      id: roomId,
    },
  });
}

async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

const bookingRepository = {
  findBookingByUserId,
  findBookingByRoomId,
  findRoom,
  createBooking,
};

export default bookingRepository;
