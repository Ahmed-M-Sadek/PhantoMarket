import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Create the Prisma Client only once and reuse it (helps with hot reloading in development)
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"], // Optional: enable logging for debugging
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
