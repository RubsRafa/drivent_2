import supertest from 'supertest';
import httpStatus from 'http-status';
import { TicketStatus } from '@prisma/client';
import { generateValidToken, cleanDb } from '../helpers';
import {
  createEnrollmentWithAddress,
  createTicket,
  createTicketType,
  createUser,
  generateCreditCardData,
  modifyCreateTicketType,
} from '../factories';
import { createHotel, createRoom } from '../factories/hotels-factory';
import app, { init } from '@/app';
import { prisma } from '@/config';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
  it('Should respond with status 401 when sending an invalid token', async () => {
    await createUser();
    const token = 'invalid token';

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 404 if subscription does not exist', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it('should respond with status 404 if ticket does not exist', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    await createEnrollmentWithAddress(user);
    await createTicketType();

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it('should respond with status 402 if ticket has not been paid', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 402 if the ticket type is remote', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const isRemote = true;
    const includesHotel = true;
    const ticketType = await modifyCreateTicketType(isRemote, includesHotel);

    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 402 if the ticket type does not include hotel', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const isRemote = false;
    const includesHotel = false;
    const ticketType = await modifyCreateTicketType(isRemote, includesHotel);

    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 404 if hotels do not exist', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const isRemote = false;
    const includesHotel = true;
    const ticketType = await modifyCreateTicketType(isRemote, includesHotel);

    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

    const body = { ticketId: ticket.id, cardData: generateCreditCardData() };
    await server.post('/payments/process').set('Authorization', `Bearer ${token}`).send(body);

    await prisma.ticket.findUnique({ where: { id: ticket.id } });

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it('should return the list of available hotels on success', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const isRemote = false;
    const includesHotel = true;
    const ticketType = await modifyCreateTicketType(isRemote, includesHotel);

    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

    const hotel = await createHotel();
    await createRoom(hotel.id);

    const body = { ticketId: ticket.id, cardData: generateCreditCardData() };
    await server.post('/payments/process').set('Authorization', `Bearer ${token}`).send(body);

    await prisma.ticket.findUnique({ where: { id: ticket.id } });

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.OK);
    expect(response.body).toEqual([
      {
        id: expect.any(Number),
        name: expect.any(String),
        image: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    ]);
  });
});

describe('GET /hotels/:hotelId', () => {
  it('Should respond with status 401 when sending an invalid token', async () => {
    await createUser();
    const token = 'invalid token';

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 404 if subscription does not exist', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);

    const hotel = await createHotel();
    await createRoom(hotel.id);

    const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it('should respond with status 404 if ticket does not exist', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    await createEnrollmentWithAddress(user);
    await createTicketType();
    const hotel = await createHotel();
    await createRoom(hotel.id);

    const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it('should respond with status 404 if hotel does not exist', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const isRemote = false;
    const includesHotel = true;
    const ticketType = await modifyCreateTicketType(isRemote, includesHotel);

    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

    const body = { ticketId: ticket.id, cardData: generateCreditCardData() };
    await server.post('/payments/process').set('Authorization', `Bearer ${token}`).send(body);

    await prisma.ticket.findUnique({ where: { id: ticket.id } });

    const response = await server.get(`/hotels/1`).set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it('should respond with status 402 if ticket has not been paid', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

    const hotel = await createHotel();
    await createRoom(hotel.id);

    const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 402 if the ticket type is remote', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const isRemote = true;
    const includesHotel = true;
    const ticketType = await modifyCreateTicketType(isRemote, includesHotel);

    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const hotel = await createHotel();
    await createRoom(hotel.id);

    const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 402 if the ticket type does not include hotel', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const isRemote = false;
    const includesHotel = false;
    const ticketType = await modifyCreateTicketType(isRemote, includesHotel);

    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const hotel = await createHotel();
    await createRoom(hotel.id);

    const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
  });

  it('should return the hotel with the list of rooms', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const isRemote = false;
    const includesHotel = true;
    const ticketType = await modifyCreateTicketType(isRemote, includesHotel);

    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

    const hotel = await createHotel();
    const room = await createRoom(hotel.id);

    const body = { ticketId: ticket.id, cardData: generateCreditCardData() };
    await server.post('/payments/process').set('Authorization', `Bearer ${token}`).send(body);

    await prisma.ticket.findUnique({ where: { id: ticket.id } });

    const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.OK);
    expect(response.body).toEqual({
      id: hotel.id,
      name: hotel.name,
      image: hotel.image,
      createdAt: hotel.createdAt.toISOString(),
      updatedAt: hotel.updatedAt.toISOString(),
      Rooms: [
        {
          id: room.id,
          name: room.name,
          capacity: room.capacity,
          hotelId: room.hotelId,
          createdAt: room.createdAt.toISOString(),
          updatedAt: room.updatedAt.toISOString(),
        },
      ],
    });
  });
});
