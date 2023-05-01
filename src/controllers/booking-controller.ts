import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';

export async function getBooking(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response> {
  const userId = req.userId as number;
  try {
    const booking = await bookingService.getBooking(userId);
    return res.status(httpStatus.OK).send(booking);
  } catch (e) {
    next(e);
  }
}
export async function postBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const userId = req.userId as number;
  const roomId = req.body.roomId as number;
  try {
    const createdBooking = await bookingService.createBooking(userId, roomId);
    return res.status(httpStatus.OK).send(createdBooking);
  } catch (e) {
    next(e);
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const userId = req.userId as number;
  const roomId = req.body.roomId as number;
  const bookingIdByParams = req.params.bookingId;
  const bookingId = Number(bookingIdByParams) as number;
  try {
    const updatedBooking = await bookingService.updateBooking(userId, roomId, bookingId);
    return res.status(httpStatus.OK).send(updatedBooking);
  } catch (e) {
    next(e);
  }
}
