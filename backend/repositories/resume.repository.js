import prisma from "../config/prisma.js";

export const findById = async (id) => {
  return prisma.resume.findFirst({
    where: { id, deletedAt: null },
  });
};

export const findAllByUserId = async (userId, { skip = 0, take = 10 }) => {
  return prisma.resume.findMany({
    where: { userId, deletedAt: null },
    orderBy: { updatedAt: "desc" },
    skip,
    take,
  });
};

export const countAllByUserId = async (userId) => {
  return prisma.resume.count({
    where: { userId, deletedAt: null },
  });
};

export const create = async (data) => {
  return prisma.resume.create({ data });
};

export const update = async (id, data) => {
  return prisma.resume.update({
    where: { id },
    data,
  });
};

export const softDelete = async (id) => {
  return prisma.resume.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

export const getStats = async (userId) => {
  // Complex aggregation can go here
  return prisma.resume.findMany({
    where: { userId, deletedAt: null },
    select: {
      id: true,
      title: true,
      atsScore: true,
      updatedAt: true,
    },
  });
};
