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

async function findBookingByUserId(userId: number) {
  return await prisma.booking.findFirst({
    where: {
      userId,
    },
    select: {
      id: true,
      Room: true,
    },
  });
}

async function updateBooking(roomId: number, bookingId: number) {
  return await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      roomId: roomId,
      updatedAt: dayjs().format('YYYY-MM-DD'),
    },
    select: {
      id: true,
    },
  });
}

async function findBookingByRoomId(roomId: number): Promise<Booking[]> {
  return await prisma.booking.findMany({
    where: {
      roomId,
    },
  });
}

const bookingRepository = {
  findBooking,
  createBooking,
  findRoomById,
  updateBooking,
  findBookingByRoomId,
  findBookingByUserId,
};

export default bookingRepository;
