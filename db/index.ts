import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Make sure to set the DATABASE_URL in your .env.local file
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);
