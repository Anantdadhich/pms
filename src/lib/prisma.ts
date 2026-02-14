import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { DATABASE_URL } from "./env";

const globalForPrisma = global as unknown as {
    prisma: PrismaClient;
};

const prisma = globalForPrisma.prisma || new PrismaClient({
    adapter: new PrismaPg({
        connectionString: DATABASE_URL,
    }),
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
