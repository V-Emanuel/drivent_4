import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import {
  createEnrollmentWithAddress,
  createUser,
  createTicket,
  createTicketTypeWithHotel,
  createRoomWithHotelId,
  createPayment,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import {
  createHotel,
  createIsIncludedHotelWithFalseTicketType,
  createIsIncludedHotelWithTrueTicketType,
  createRoom,
} from '../factories/hotels-factory';
import { createBookingTest, createBooking } from '../factories/booking-factory';
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
    const ticketType = await createIsIncludedHotelWithTrueTicketType();
    const enrollment = await createEnrollmentWithAddress(user);
    await createTicket(enrollment.id, ticketType.id, 'PAID');
    const hotel = await createHotel();
    const room = await createRoom(hotel.id);
    await createBookingTest(user.id, room.id);

    const result = await server.get('/booking').set('Authorization', `Bearer ${token}`);
    expect(result.status).toBe(httpStatus.OK);
    expect(result.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        Room: expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          capacity: expect.any(Number),
          hotelId: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      }),
    );
  }),
]);

describe('POST /booking', () => {
  it('Faz o post quando o token é válido', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const ticketType = await createIsIncludedHotelWithTrueTicketType();
    const enrollment = await createEnrollmentWithAddress(user);
    await createTicket(enrollment.id, ticketType.id, 'PAID');
    const hotel = await createHotel();
    const room = await createRoom(hotel.id);

    const result = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

    expect(result.status).toEqual(httpStatus.OK);
  });
});

describe('PUT /booking/:booking', () => {
  it('Atualiza o booking quando o token é válido', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithHotel();
    const ticket = await createTicket(enrollment.id, ticketType.id, 'PAID');
    const payment = await createPayment(ticket.id, ticketType.price);
    const hotel = await createHotel();
    const room = await createRoom(hotel.id);
    const otherRoom = await createRoomWithHotelId(hotel.id);
    const booking = await createBooking(room.id, user.id);
    const result = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send({
      roomId: otherRoom.id,
    });

    expect(result.status).toBe(httpStatus.OK);
  });
});
