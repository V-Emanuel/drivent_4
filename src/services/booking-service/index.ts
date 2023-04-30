import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { notFoundError } from '@/errors';

async function getBooking(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();
  const booking = await bookingRepository.findBooking(userId);
  if (!booking) throw notFoundError();

  return booking;
}
async function createBooking(userId: number, roomId: number) {
  const roomById = await bookingRepository.findRoomById(roomId);
  if (!roomById) throw notFoundError();

  const booking = await bookingRepository.createBooking(userId, roomId);

  return {
    bookingId: booking.id,
  };
}

const bookingService = {
  getBooking,
  createBooking,
};
export default bookingService;
