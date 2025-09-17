const express = require('express');
const cors = require('cors');
const { connectToDatabase } = require('./utils/db');
const middleware = require('./utils/middlewares');

const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const blogsRouter = require('./controllers/blogs');
const authorsRouter = require('./controllers/authors');
const readingListsRouter = require('./controllers/readingLists');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.send('Working');
});

app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/authors', authorsRouter);
app.use('/api/readinglists', readingListsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

const init = async () => {
  await connectToDatabase();
};

init();

module.exports = app;