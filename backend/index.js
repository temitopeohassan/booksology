import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Create a MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'booksology_db',
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
  console.log('GET /api - Welcome endpoint hit');
  res.send('Welcome to the Booksology API');
});

app.get('/api/books', async (req, res) => {
  console.log('GET /api/books - Fetching all books');

  const query = `
    SELECT 
      id, title, author, cover, price, description, 
      preview, created_at, encrypted_content, 
      featured_books, tokenID, categories_id
    FROM books
  `;

  try {
    // Execute the query to fetch all books
    const [rows] = await db.query(query);
    console.log('Books fetched:', rows);
    res.json(rows);  // Send the results as JSON
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

app.get('/api/books/:id', async (req, res) => {
  const bookId = req.params.id;
  console.log(`GET /api/books/${bookId} - Fetching book by ID`);

  const query = `
    SELECT 
      id, title, author, cover, price, description, 
      preview, created_at, encrypted_content, 
      featured_books, tokenID, categories_id
    FROM books
    WHERE id = ?
  `;

  try {
    const [rows] = await db.query(query, [bookId]);

    if (!rows.length) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(`Error fetching book by ID ${bookId}:`, error); // More detailed error log
    res.status(500).json({ error: 'Failed to fetch the book', details: error.message }); // Include error details
  }
});



app.get('/api/featured-books', async (req, res) => {
  console.log('GET /api/featured-books - Fetching featured books');
  try {
    const [rows] = await db.query(`
      SELECT id, title, author, cover
      FROM books
      WHERE featured_books = true
      ORDER BY created_at DESC
    `);
    console.log('Featured books fetched:', rows);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching featured books:', err);
    res.status(500).json({ error: 'Failed to fetch featured books' });
  }
});

app.get('/api/categories', async (req, res) => {
  console.log('GET /api/categories - Fetching categories');
  try {
    const [rows] = await db.query('SELECT id, name, icon FROM categories');
    console.log('Categories fetched:', rows);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.get('/api/new-releases', async (req, res) => {
  console.log('GET /api/new-releases - Fetching new releases');
  try {
    const [rows] = await db.query(`
      SELECT id, title, author, cover
      FROM books
      ORDER BY created_at DESC
      LIMIT 4
    `);
    console.log('New releases fetched:', rows);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching new releases:', err);
    res.status(500).json({ error: 'Failed to fetch new releases' });
  }
});

app.get('/api/marketplace/books', async (req, res) => {
  console.log('GET /api/marketplace/books - Fetching marketplace books');
  const { search, minPrice, maxPrice, sort, category } = req.query;

  let query = `
    SELECT b.id, b.title, b.author, b.cover, b.price, c.name AS category
    FROM books b
    LEFT JOIN categories c ON b.categories_id = c.id
  `;
  
  const queryParams = [];
  const conditions = [];

  // Apply search filter (search by title or author)
  if (search) {
    conditions.push('(b.title LIKE ? OR b.author LIKE ?)');
    queryParams.push(`%${search}%`, `%${search}%`);
  }

  // Apply minPrice filter
  if (minPrice) {
    conditions.push('b.price >= ?');
    queryParams.push(Number(minPrice));
  }

  // Apply maxPrice filter
  if (maxPrice) {
    conditions.push('b.price <= ?');
    queryParams.push(Number(maxPrice));
  }

  // Apply category filter
  if (category) {
    conditions.push('b.categories_id = ?');
    queryParams.push(Number(category));
  }

  // Append conditions to the query
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  // Apply sorting
  if (sort) {
    switch (String(sort)) {
      case 'price_asc':
        query += ' ORDER BY b.price ASC';
        break;
      case 'price_desc':
        query += ' ORDER BY b.price DESC';
        break;
      default:
        query += ' ORDER BY b.created_at DESC';
    }
  } else {
    query += ' ORDER BY b.created_at DESC';  // Default sort by creation date
  }

  try {
    // Execute the query with the parameters
    const [rows] = await db.query(query, queryParams);
    res.json(rows);  // Return the results as JSON
  } catch (err) {
    console.error('Error fetching marketplace books:', err);
    res.status(500).json({ error: 'Failed to fetch marketplace books' });
  }
});

app.get('/api/library/owned-books', async (req, res) => {
  console.log('GET /api/library/owned-books - Fetching owned books');
  const userId = 1; // Replace with actual user authentication

  try {
    const [rows] = await db.query(`
      SELECT b.id, b.title, b.author, b.cover, ub.progress, ub.book_for_sale
      FROM user_books ub
      JOIN books b ON ub.book_id = b.id
      WHERE ub.user_id = ?
    `, [userId]);
    
    res.json(rows);
  } catch (err) {
    console.error('Error fetching owned books:', err);
    res.status(500).json({ error: 'Failed to fetch owned books' });
  }
});


app.get('/api/profile/personal-info', async (req, res) => {
  console.log('GET /api/profile/personal-info - Fetching personal info');
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
  console.log('GET /api/profile/transactions - Fetching transactions');
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
  console.log('GET /api/profile/wallet - Fetching wallet info');
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
  console.log('GET /api/profile/preferences - Fetching preferences');
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
  console.log('POST /api/profile/update-personal-info - Updating personal info');
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

app.get('/api/reader/:title', async (req, res) => {
  const { title } = req.params;
  console.log(`GET /api/reader/${title} - Fetching book content`);

  try {
    const [book] = await db.query(`
      SELECT b.title, b.author, cc.content
      FROM books b
      JOIN chapters c ON b.id = c.book_id
      JOIN chapter_content cc ON c.id = cc.chapter_id
      WHERE b.title = ? AND c.chapter_number = 1
    `, [title]);

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
