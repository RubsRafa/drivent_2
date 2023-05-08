import faker from '@faker-js/faker';
import { prisma } from '@/config';

//Sabe criar objetos - Hotel do banco
export async function createHotel() {
  return await prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.image.imageUrl(),
    },
  });
}

export async function createRoomWithHotelId(hotelId: number) {
  return prisma.room.create({
    data: {
      name: '1020',
      capacity: 3,
      hotelId: hotelId,
    },
  });
}

export async function createRoomWithHotelIdNoCapacity(hotelId: number) {
  return prisma.room.create({
    data: {
      name: '1020',
      capacity: 0,
      hotelId: hotelId,
    },
  });
}

export async function returnHotel() {
  return {
    id: faker.datatype.number(),
    name: faker.datatype.string(),
    image: faker.datatype.string(),
    createdAt: faker.datatype.datetime(),
    updatedAt: faker.datatype.datetime(),
  };
}

export async function returnHotelWithRoom() {
  return {
    id: faker.datatype.number(),
    name: faker.datatype.string(),
    image: faker.datatype.string(),
    createdAt: faker.datatype.datetime(),
    updatedAt: faker.datatype.datetime(),
    Rooms: [
      {
        id: faker.datatype.number(),
        name: faker.datatype.string(),
        capacity: faker.datatype.number(),
        hotelId: faker.datatype.number(),
        createdAt: faker.datatype.datetime(),
        updatedAt: faker.datatype.datetime(),
      },
    ],
  };
}
