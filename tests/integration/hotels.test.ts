// import faker from "@faker-js/faker";
// import supertest from "supertest";
import { cleanDb } from '../helpers';
import app, { init } from '@/app';
// import httpStatus from 'http-status';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

// const server = supertest(app);

describe('GET /hotels', () => {
  // it('should respond with status 401 if no token is given', async () => {
  //     const response = await server.get('/hotels');
  //     expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  //   });
});
