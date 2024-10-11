import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Book } from '../entities/Book';

export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await AppDataSource.getRepository(Book).find();
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getBookDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const book = await AppDataSource.getRepository(Book).findOne({ where: { id: parseInt(id) } });
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json(book);
  } catch (error) {
    console.error('Error fetching book details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const purchaseBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    const book = await AppDataSource.getRepository(Book).findOne({ where: { id: parseInt(id) } });
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    // Implement purchase logic here
    
    res.json({ message: 'Book purchased successfully', bookId: id, userId });
  } catch (error) {
    console.error('Error purchasing book:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};