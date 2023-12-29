const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;
app.use(cors());
// Connect to MongoDB
mongoose.connect('mongodb+srv://anmol4979199:anmol123@test.8oysegr.mongodb.net/scertbooks', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define Book schema
const bookSchema = new mongoose.Schema({
  student_class: Number,
  subject: String,
  language: String,
  chapterNumber: Number,
  bookLink: String,
});

const Book = mongoose.model('Book', bookSchema);

// Middleware for parsing JSON data
app.use(bodyParser.json());

// Routes

// Get all books
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new book
app.post('/books', async (req, res) => {
  const {student_class, subject, language, chapterNumber, bookLink } = req.body;

  try {
    const newBook = new Book({ student_class, subject, language, chapterNumber, bookLink });
    await newBook.save();
    res.json(newBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a book by ID
app.put('/books/:id', async (req, res) => {
  const { student_class, subject, language, chapterNumber, bookLink } = req.body;

  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { student_class, subject, language, chapterNumber, bookLink },
      { new: true }
    );
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove a book by ID
app.delete('/books/:id', async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
