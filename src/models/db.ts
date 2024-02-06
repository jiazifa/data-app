import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient = new PrismaClient();

const getDB = () => {
  return prisma;
};

export { getDB };
