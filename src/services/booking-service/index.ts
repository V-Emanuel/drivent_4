import bookingRepository from '@/repositories/booking-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { notFoundError, forbiddenError, paymentRequiredError } from '@/errors';

async function getBooking(userId: number) {
  const booking = await bookingRepository.findBooking(userId);
  if (!booking) throw notFoundError();

  return booking;
}
async function createBooking(userId: number, roomId: number) {
  const roomById = await bookingRepository.findRoomById(roomId);
  const enrollment = await enrollmentRepository.findUserById(userId);
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

  const ticketType = await ticketsRepository.findTicketTypeById(ticket.ticketTypeId);

  if (!enrollment || !ticket || !roomById) throw notFoundError();
  if (ticket.status !== 'PAID' || ticketType.includesHotel !== true || ticketType.isRemote === true) {
    throw paymentRequiredError();
  }

  const booking = await bookingRepository.createBooking(userId, roomId);

  return {
    bookingId: booking.id,
  };
}

async function updateBooking(userId: number, roomId: number, bookingId: number) {
  const booking = await bookingRepository.findBookingByUserId(userId);
  if (!booking) throw forbiddenError();

  const room = await bookingRepository.findRoomById(roomId);
  if (!room) throw notFoundError();

  const bookingByRoomId = await bookingRepository.findBookingByRoomId(roomId);
  if (bookingByRoomId.length === room.capacity) throw forbiddenError();

  const updatedBooking = await bookingRepository.updateBooking(roomId, bookingId);

  return {
    bookingId: updatedBooking.id,
  };
}

const bookingService = {
  getBooking,
  createBooking,
  updateBooking,
};
export default bookingService;
