import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import { prisma } from '@/config';

export async function createTicketType() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: faker.datatype.boolean(),
      includesHotel: faker.datatype.boolean(),
    },
  });
}

export async function createTicket(enrollmentId: number, ticketTypeId: number, status: TicketStatus) {
  return prisma.ticket.create({
    data: {
      enrollmentId,
      ticketTypeId,
      status,
    },
  });
}

export async function createTicketTypeRemote() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: true,
      includesHotel: faker.datatype.boolean(),
    },
  });
}

export async function createTicketTypeWithHotel() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: false,
      includesHotel: true,
    },
  });
}

export function returnTicketWithType(isRemote: boolean, includesHotel: boolean, status: string) {
  return {
    id: faker.datatype.number(),
    ticketTypeId: faker.datatype.number(),
    enrollmentId: faker.datatype.number(),
    createdAt: faker.datatype.datetime(),
    updatedAt: faker.datatype.datetime(),
    status,
    TicketType: {
      id: faker.datatype.number(),
      name: faker.datatype.string(),
      price: faker.datatype.number(),
      isRemote,
      includesHotel,
      createdAt: faker.datatype.datetime(),
      updatedAt: faker.datatype.datetime(),
    },
  };
}
