import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/index.js'; 

// Se lee la URL generada por create-db
const connectionString = process.env.DATABASE_URL; 
const pool = new Pool({ connectionString });

// Se crea el adaptador
const adapter = new PrismaPg(pool);

// Se instancia Prisma pasándole el adaptador
export const prisma = new PrismaClient({ adapter });

export default prisma;