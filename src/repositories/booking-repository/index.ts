import { Room, Booking } from '@prisma/client';
import dayjs from 'dayjs';
import { prisma } from '@/config';

async function findBooking(userId: number) {
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
async function createBooking(userId: number, roomId: number): Promise<idType> {
  return await prisma.booking.create({
    data: {
      userId,
      roomId,
    },
    select: {
      id: true,
    },
  });
}
export type idType = {
  id: number;
};

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
      roomId,
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
