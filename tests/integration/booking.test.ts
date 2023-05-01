import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import { cleanDb, generateValidToken } from '../helpers';
import {
  createEnrollmentWithAddress,
  createUser,
  createIsIncludedHotelWithFalseTicketType,
  createTicket,
  createHotel,
  createRoom,
} from '../factories';
import { createBookingTest } from '../factories/booking-factory';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});
beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => [
  it('Retorna 200 quando o token é válido', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const ticketType = await createIsIncludedHotelWithFalseTicketType();
    const enrollment = await createEnrollmentWithAddress(user);
    await createTicket(enrollment.id, ticketType.id, 'PAID');
    const hotel = await createHotel();
    const room = await createRoom(hotel.id);
    await createBookingTest(user.id, room.id);

    const result = await server.get('/booking').set('Authorization', `Bearer ${token}`);
    expect(result.status).toBe(httpStatus.OK);
  }),
]);
