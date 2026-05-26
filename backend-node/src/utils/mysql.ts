import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL não definido em .env');
}

export const db = mysql.createPool({
  uri: connectionString,
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
});
