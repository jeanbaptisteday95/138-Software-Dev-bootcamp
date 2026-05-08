const express = require('express');
const app = express();
require('dotenv').config();

const port = process.env.PORT || 3000;

// Simulated database: Books array
let books = [
  { id: 1, title: '1984', author: 'George Orwell', year: 1949 },
  { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960 }
];

// Middleware to parse JSON
app.use(express.json());

// CRUD Routes

// 1. Get all books
app.get('/books', (req, res) => {
  res.json(books);
});

// 2. Get a single book by ID
app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).send('Book not found');
  res.json(book);
});

// 3. Create a new book
app.post('/books', (req, res) => {
  const newBook = {
    id: books.length + 1,
    title: req.body.title,
    author: req.body.author,
    year: req.body.year
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

// 4. Update an existing book
app.put('/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).send('Book not found');

  book.title = req.body.title || book.title;
  book.author = req.body.author || book.author;
  book.year = req.body.year || book.year;

  res.json(book);
});

// 5. Delete a book
app.delete('/books/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
  if (bookIndex === -1) return res.status(404).send('Book not found');

  const deletedBook = books.splice(bookIndex, 1);
  res.json(deletedBook);
});

// Start server
app.listen(port, () => {
  console.log(`Bookstore app listening at http://localhost:${port}`);
});
