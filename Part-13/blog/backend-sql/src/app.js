const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectToDatabase } = require('./utils/db');
const middleware = require('./utils/middlewares');

const usersRouter = require('./controllers/users');
const authRouter = require('./controllers/auth');
const blogsRouter = require('./controllers/blogs');
const authorsRouter = require('./controllers/authors');
const readingListsRouter = require('./controllers/readingLists');

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.send('Working');
});

app.use('/api/users', usersRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/authors', authorsRouter);
app.use('/api/readinglists', readingListsRouter);
app.use('/api', authRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

const init = async () => {
  await connectToDatabase();
};

init();

module.exports = app;