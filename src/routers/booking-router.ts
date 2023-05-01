import { Router } from 'express';
import { getBooking, postBooking, updateBooking } from '@/controllers/booking-controller';
import { authenticateToken, validateBody } from '@/middlewares';
import { bookingSchema } from '@/schemas/booking-schemas';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('/', getBooking)
  .post('/', validateBody(bookingSchema), postBooking)
  .put('/:bookingId', validateBody(bookingSchema), updateBooking);

export { bookingRouter };
