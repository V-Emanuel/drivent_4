import { Booking, Room } from '@prisma/client';
import dayjs = require('dayjs');
import { prisma } from '@/config';

async function findBooking(userId: number) {
  const booking = await prisma.booking.findFirst({
    where: {
      id: userId,
    },
  });
  const rooms = await prisma.room.findFirst({
    where: {
      id: booking.roomId,
    },
  });
  return {
    id: booking.id,
    Room: rooms,
  };
}

async function createBooking(userId: number, roomId: number): Promise<Booking> {
  return prisma.booking.create({
    data: {
      userId: userId,
      roomId: roomId,
      createdAt: dayjs().format('YYYY-MM-DD'),
      updatedAt: dayjs().format('YYYY-MM-DD'),
    },
  });
}

async function findRoomById(roomId: number): Promise<Room> {
  return await prisma.room.findFirst({
    where: {
      id: roomId,
    },
  });
}

const bookingRepository = {
  findBooking,
  createBooking,
  findRoomById,
};

export default bookingRepository;
