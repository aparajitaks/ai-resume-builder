import prisma from "../config/prisma.js";
import { nanoid } from "nanoid";

export const findUserByEmail = async (email) => {
  return prisma.user.findFirst({
    where: { email, deletedAt: null },
  });
};

export const findUserById = async (id) => {
  return prisma.user.findFirst({
    where: { id, deletedAt: null },
  });
};

export const createUser = async (userData) => {
  return prisma.user.create({
    data: {
      ...userData,
      referralCode: nanoid(8),
    },
  });
};

export const updateRefreshToken = async (userId, refreshToken) => {
  return prisma.user.update({
    where: { id: userId },
    data: { refreshToken },
  });
};
