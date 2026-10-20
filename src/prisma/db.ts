import 'temporal-polyfill/full/global';
import 'dotenv/config';
import postgres from '@prisma/orm-postgres/runtime';
import type { Contract } from './contract.d';
import contractJson from './contract.json' with { type: 'json' };

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: ReturnType<typeof postgres<Contract>>;
};

export const  db =
  globalForPrisma.prisma ??
  postgres<Contract>({
    contractJson,
    url: process.env['DATABASE_URL']!,
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
