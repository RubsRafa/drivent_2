import faker from '@faker-js/faker';

export function returnRoom(capacity: number) {
  return {
    id: faker.datatype.number(),
    name: faker.datatype.string(),
    capacity,
    hotelId: faker.datatype.number(),
    createdAt: faker.datatype.datetime(),
    updatedAt: faker.datatype.datetime(),
  };
}

export function returnBookingWithRoom() {
  return {
    id: faker.datatype.number(),
    userId: faker.datatype.number(),
    roomId: faker.datatype.number(),
    createdAt: faker.datatype.datetime(),
    updatedAt: faker.datatype.datetime(),
    Room: {
      id: faker.datatype.number(),
      name: faker.datatype.string(),
      capacity: faker.datatype.number(),
      hotelId: faker.datatype.number(),
      createdAt: faker.datatype.datetime(),
      updatedAt: faker.datatype.datetime(),
    },
  };
}

export function returnBooking() {
  return {
    id: faker.datatype.number(),
    userId: faker.datatype.number(),
    roomId: faker.datatype.number(),
    createdAt: faker.datatype.datetime(),
    updatedAt: faker.datatype.datetime(),
  };
}
