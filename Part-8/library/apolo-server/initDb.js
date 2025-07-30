// Execute this script by npm run init:mongo:db just once for initiate DB data
const mongoose = require('mongoose')
require('dotenv').config()

const Book = require('./src/models/book')
const Author = require('./src/models/author')

const TEST_MONGODB_URI = process.env.TEST_MONGODB_URI

const authors = [
  { name: 'Robert Martin', born: 1952 },
  { name: 'Martin Fowler', born: 1963 },
  { name: 'Fyodor Dostoevsky', born: 1821 },
  { name: 'Joshua Kerievsky' },
  { name: 'Sandi Metz' },
]

const books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    genres: ['refactoring', 'patterns']
  },
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    genres: ['classic', 'crime']
  },
  {
    title: 'Demons',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    genres: ['classic', 'revolution']
  },
]

const seed = async () => {
  try {
    await mongoose.connect(TEST_MONGODB_URI)
    console.log('Connected to MongoDB')

    await Author.deleteMany({})
    await Book.deleteMany({})

    const authorDocs = await Author.insertMany(authors)
    const authorMap = {}
    authorDocs.forEach(author => {
      authorMap[author.name] = author._id
    })

    const bookDocs = books.map(book => ({
      title: book.title,
      published: book.published,
      genres: book.genres,
      author: authorMap[book.author]
    }))

    await Book.insertMany(bookDocs)

    console.log('Seeding completed')
  } catch (error) {
    console.error('Error during seeding:', error.message)
  } finally {
    await mongoose.connection.close()
  }
}

seed()
