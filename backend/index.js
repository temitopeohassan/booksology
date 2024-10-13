import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

import mysql from 'mysql2/promise'; // Using promise-based MySQL

// Create a MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'booksology'
});

// Middleware to ensure connection is established
app.use(async (req, res, next) => {
  try {
    // Check if the connection is active
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
    const [rows] = await db.query('SELECT title, author, cover FROM featured_books');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching featured books:', err);
    res.status(500).json({ error: 'Failed to fetch featured books' });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT name, book_count as bookCount, icon FROM categories');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.get('/api/new-releases', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT title, author, cover FROM new_releases');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching new releases:', err);
    res.status(500).json({ error: 'Failed to fetch new releases' });
  }
});

app.get('/api/marketplace/books', async (req, res) => {
  const { search, minPrice, maxPrice, sort } = req.query;
  let query = 'SELECT * FROM marketplace_books';
  const queryParams = [];

  if (search) {
    query += ' WHERE title LIKE ? OR author LIKE ?';
    queryParams.push(`%${search}%`, `%${search}%`);
  }

  if (minPrice) {
    query += queryParams.length ? ' AND' : ' WHERE';
    query += ' price >= ?';
    queryParams.push(Number(minPrice));
  }

  if (maxPrice) {
    query += queryParams.length ? ' AND' : ' WHERE';
    query += ' price <= ?';
    queryParams.push(Number(maxPrice));
  }

  if (sort) {
    switch (String(sort)) {
      case 'price_asc':
        query += ' ORDER BY price ASC';
        break;
      case 'price_desc':
        query += ' ORDER BY price DESC';
        break;
      default:
        query += ' ORDER BY id DESC';
    }
  } else {
    query += ' ORDER BY id DESC';
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
    const [rows] = await db.query('SELECT name FROM marketplace_categories');
    res.json(rows.map(row => row.name));
  } catch (err) {
    console.error('Error fetching marketplace categories:', err);
    res.status(500).json({ error: 'Failed to fetch marketplace categories' });
  }
});

app.get('/api/library/owned-books', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM user_library_owned_books');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching owned books:', err);
    res.status(500).json({ error: 'Failed to fetch owned books' });
  }
});

app.get('/api/library/recently-read', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM user_library_recently_read');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching recently read books:', err);
    res.status(500).json({ error: 'Failed to fetch recently read books' });
  }
});

app.get('/api/library/reading-stats', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM user_library_stats');
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching reading stats:', err);
    res.status(500).json({ error: 'Failed to fetch reading stats' });
  }
});

app.get('/api/profile/personal-info', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM user_profile');
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching personal info:', err);
    res.status(500).json({ error: 'Failed to fetch personal info' });
  }
});

app.get('/api/profile/transactions', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM user_transactions');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

app.get('/api/profile/wallet', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM user_wallet');
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching wallet info:', err);
    res.status(500).json({ error: 'Failed to fetch wallet info' });
  }
});

app.get('/api/profile/preferences', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM user_preferences');
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching preferences:', err);
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
});

app.post('/api/profile/update-personal-info', async (req, res) => {
  const { displayName, email, bio } = req.body;
  try {
    await db.query('UPDATE user_profile SET display_name = ?, email = ?, bio = ? WHERE id = 1', [displayName, email, bio]);
    res.json({ message: 'Personal info updated successfully' });
  } catch (err) {
    console.error('Error updating personal info:', err);
    res.status(500).json({ error: 'Failed to update personal info' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});