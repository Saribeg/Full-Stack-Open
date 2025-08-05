// Execute this script by npm run init:mongo:db just once for initiate DB data
const mongoose = require('mongoose');
require('dotenv').config();
const logger = require('./src/utils/logger');

const Book = require('./src/models/book');
const Author = require('./src/models/author');

const TEST_MONGODB_URI = process.env.TEST_MONGODB_URI;

const authors = require('./test-data-generation/authors');
const books = require('./test-data-generation/books');

const seed = async () => {
  try {
    await mongoose.connect(TEST_MONGODB_URI);
    logger.info('Connected to MongoDB');

    await Author.deleteMany({});
    await Book.deleteMany({});

    const authorDocs = await Author.insertMany(authors);
    const authorMap = {};
    authorDocs.forEach(author => {
      authorMap[author.name] = author._id;
    });

    const bookDocs = books.map(book => ({
      title: book.title,
      published: book.published,
      genres: book.genres,
      author: authorMap[book.author]
    }));

    await Book.insertMany(bookDocs);

    logger.info('Seeding completed');
  } catch (error) {
    logger.error('Error during seeding:', error.message);
  } finally {
    await mongoose.connection.close();
  }
};

seed();
