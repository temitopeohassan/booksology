import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Create a MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'booksology',
  port: process.env.DB_PORT || '3306',
});

// Middleware to ensure connection is established
app.use(async (req, res, next) => {
  try {
    await db.getConnection();
    next();
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).send('Database connection failed');
  }
});

// Endpoints
app.get('/api', (req, res) => {
  res.send('Welcome to the Booksology API');
});

app.get('/api/featured-books', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT b.id, b.title, b.author, b.cover
      FROM featured_books fb
      JOIN books b ON fb.book_id = b.id
      WHERE fb.feature_end_date IS NULL OR fb.feature_end_date > NOW()
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching featured books:', err);
    res.status(500).json({ error: 'Failed to fetch featured books' });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, icon FROM categories');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.get('/api/new-releases', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT b.id, b.title, b.author, b.cover
      FROM books b
      ORDER BY b.created_at DESC
      LIMIT 10
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching new releases:', err);
    res.status(500).json({ error: 'Failed to fetch new releases' });
  }
});

app.get('/api/marketplace/books', async (req, res) => {
  const { search, minPrice, maxPrice, sort, category } = req.query;
  let query = `
    SELECT b.id, b.title, b.author, b.cover, b.price, bfs.id AS listing_id, u.display_name AS seller
    FROM books_for_sale bfs
    JOIN books b ON bfs.book_id = b.id
    JOIN users u ON bfs.seller_id = u.id
  `;
  const queryParams = [];
  const conditions = [];

  if (search) {
    conditions.push('(b.title LIKE ? OR b.author LIKE ?)');
    queryParams.push(`%${search}%`, `%${search}%`);
  }

  if (minPrice) {
    conditions.push('bfs.price >= ?');
    queryParams.push(Number(minPrice));
  }

  if (maxPrice) {
    conditions.push('bfs.price <= ?');
    queryParams.push(Number(maxPrice));
  }

  if (category) {
    query += ' JOIN book_categories bc ON b.id = bc.book_id';
    conditions.push('bc.category_id = ?');
    queryParams.push(Number(category));
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  if (sort) {
    switch (String(sort)) {
      case 'price_asc':
        query += ' ORDER BY bfs.price ASC';
        break;
      case 'price_desc':
        query += ' ORDER BY bfs.price DESC';
        break;
      default:
        query += ' ORDER BY bfs.listed_at DESC';
    }
  } else {
    query += ' ORDER BY bfs.listed_at DESC';
  }

  try {
    const [rows] = await db.query(query, queryParams);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching marketplace books:', err);
    res.status(500).json({ error: 'Failed to fetch marketplace books' });
  }
});

app.get('/api/marketplace/categories', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name FROM categories');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching marketplace categories:', err);
    res.status(500).json({ error: 'Failed to fetch marketplace categories' });
  }
});

app.get('/api/library/owned-books', async (req, res) => {
  const userId = 1; // Replace with actual user authentication
  try {
    const [rows] = await db.query(`
      SELECT b.id, b.title, b.author, b.cover, ub.progress, bn.token_id
      FROM user_books ub
      JOIN books b ON ub.book_id = b.id
      JOIN book_nfts bn ON b.id = bn.book_id
      WHERE ub.user_id = ?
    `, [userId]);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching owned books:', err);
    res.status(500).json({ error: 'Failed to fetch owned books' });
  }
});

app.get('/api/library/recently-read', async (req, res) => {
  const userId = 1; // Replace with actual user authentication
  try {
    const [rows] = await db.query(`
      SELECT b.id, b.title, rs.start_time, rs.end_time
      FROM reading_sessions rs
      JOIN books b ON rs.book_id = b.id
      WHERE rs.user_id = ?
      ORDER BY rs.end_time DESC
      LIMIT 5
    `, [userId]);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching recently read books:', err);
    res.status(500).json({ error: 'Failed to fetch recently read books' });
  }
});

app.get('/api/library/reading-stats', async (req, res) => {
  const userId = 1; // Replace with actual user authentication
  try {
    const [rows] = await db.query(`
      SELECT 
        COUNT(DISTINCT book_id) AS books_read,
        SUM(TIMESTAMPDIFF(MINUTE, start_time, end_time)) AS total_reading_time,
        AVG(TIMESTAMPDIFF(MINUTE, start_time, end_time)) AS avg_daily_reading
      FROM reading_sessions
      WHERE user_id = ?
    `, [userId]);
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching reading stats:', err);
    res.status(500).json({ error: 'Failed to fetch reading stats' });
  }
});

app.get('/api/profile/personal-info', async (req, res) => {
  const userId = 1; // Replace with actual user authentication
  try {
    const [rows] = await db.query('SELECT id, display_name, email, bio FROM users WHERE id = ?', [userId]);
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching personal info:', err);
    res.status(500).json({ error: 'Failed to fetch personal info' });
  }
});

app.get('/api/profile/transactions', async (req, res) => {
  const userId = 1; // Replace with actual user authentication
  try {
    const [rows] = await db.query('SELECT * FROM transactions WHERE user_id = ?', [userId]);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

app.get('/api/profile/wallet', async (req, res) => {
  const userId = 1; // Replace with actual user authentication
  try {
    const [rows] = await db.query('SELECT id, address, balance FROM wallets WHERE user_id = ?', [userId]);
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching wallet info:', err);
    res.status(500).json({ error: 'Failed to fetch wallet info' });
  }
});

app.get('/api/profile/preferences', async (req, res) => {
  const userId = 1; // Replace with actual user authentication
  try {
    const [rows] = await db.query('SELECT * FROM user_preferences WHERE user_id = ?', [userId]);
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching preferences:', err);
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
});

app.post('/api/profile/update-personal-info', async (req, res) => {
  const userId = 1; // Replace with actual user authentication
  const { displayName, email, bio } = req.body;
  try {
    await db.query('UPDATE users SET display_name = ?, email = ?, bio = ? WHERE id = ?', [displayName, email, bio, userId]);
    res.json({ message: 'Personal info updated successfully' });
  } catch (err) {
    console.error('Error updating personal info:', err);
    res.status(500).json({ error: 'Failed to update personal info' });
  }
});

app.get('/api/reader/:bookId', async (req, res) => {
  const { bookId } = req.params;
  try {
    const [book] = await db.query(`
      SELECT b.title, b.author, cc.content
      FROM books b
      JOIN chapters c ON b.id = c.book_id
      JOIN chapter_content cc ON c.id = cc.chapter_id
      WHERE b.id = ? AND c.chapter_number = 1
    `, [bookId]);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({
      title: book.title,
      author: book.author,
      content: book.content
    });
  } catch (err) {
    console.error('Error fetching book content:', err);
    res.status(500).json({ error: 'Failed to fetch book content' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});