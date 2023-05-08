import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createPayment(ticketId: number, value: number) {
  return prisma.payment.create({
    data: {
      ticketId,
      value,
      cardIssuer: faker.name.findName(),
      cardLastDigits: faker.datatype.number({ min: 1000, max: 9999 }).toString(),
    },
  });
}

export function generateCreditCardData() {
  const futureDate = faker.date.future();

  return {
    issuer: faker.name.findName(),
    number: faker.datatype.number({ min: 100000000000000, max: 999999999999999 }).toString(),
    name: faker.name.findName(),
    expirationDate: `${futureDate.getMonth() + 1}/${futureDate.getFullYear()}`,
    cvv: faker.datatype.number({ min: 100, max: 999 }).toString(),
  };
}

export function returnTicketWithEnrollment() {
  return {
    id: faker.datatype.number(),
    ticketTypeId: faker.datatype.number(),
    enrollmentId: faker.datatype.number(),
    createdAt: faker.datatype.datetime(),
    updatedAt: faker.datatype.datetime(),
    status: faker.datatype.string(),
    Enrollment: {
      id: faker.datatype.number(),
      name: faker.datatype.string(),
      cpf: faker.datatype.string(),
      birthday: faker.datatype.datetime(),
      phone: faker.datatype.string(),
      userId: faker.datatype.number(),
      createdAt: faker.datatype.datetime(),
      updatedAt: faker.datatype.datetime(),
    },
  };
}

export function returnEnrollment() {
  return {
    id: faker.datatype.number(),
    name: faker.datatype.string(),
    cpf: faker.datatype.string(),
    birthday: faker.datatype.datetime(),
    phone: faker.datatype.string(),
    userId: faker.datatype.number(),
    createdAt: faker.datatype.datetime(),
    updatedAt: faker.datatype.datetime(),
  };
}

export function returnPayment() {
  return {
    id: faker.datatype.number(),
    ticketId: faker.datatype.number(),
    value: faker.datatype.number(),
    cardIssuer: faker.datatype.string(),
    cardLastDigits: faker.datatype.string(),
    createdAt: faker.datatype.datetime(),
    updatedAt: faker.datatype.datetime(),
  };
}

export function returnCardData() {
  return {
    issuer: faker.datatype.string(),
    number: faker.datatype.number(),
    name: faker.datatype.string(),
    expirationDate: faker.datatype.datetime(),
    cvv: faker.datatype.number(),
  };
}
