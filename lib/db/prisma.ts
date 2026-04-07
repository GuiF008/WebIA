import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
  _prisma: InstanceType<typeof PrismaClient> | undefined;
};

function createPrismaClient(): InstanceType<typeof PrismaClient> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is not set. Please configure it in .env.local'
    );
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

/**
 * Lazy Prisma singleton — instancié uniquement au premier accès,
 * ce qui permet au build de passer sans DATABASE_URL.
 */
export const prisma = new Proxy({} as InstanceType<typeof PrismaClient>, {
  get(_target, prop) {
    if (!globalForPrisma._prisma) {
      globalForPrisma._prisma = createPrismaClient();
    }
    return Reflect.get(globalForPrisma._prisma, prop);
  },
});
