import { PrismaClient } from "@prisma/client";
let prisma: PrismaClient;

const getDB = () => {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
};

export { getDB };
