import prisma from "../config/prisma.js";

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
    data: userData,
  });
};

export const updateRefreshToken = async (userId, refreshToken) => {
  return prisma.user.update({
    where: { id: userId },
    data: { refreshToken },
  });
};
