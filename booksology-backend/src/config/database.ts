import { createConnection } from 'typeorm';
import { Book } from '../entities/Book';

export const initDatabase = async () => {
  try {
    const connection = await createConnection({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'booksology',
      entities: [Book],
      synchronize: true,
    });
    console.log('Database connected successfully');
    return connection;
  } catch (error) {
    console.error('Database connection failed', error);
    throw error;
  }
};