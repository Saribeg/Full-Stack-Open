const readingListsRouter = require('express').Router();
const { userExtractor } = require('../utils/middlewares');
const { ReadingList } = require('../models');

readingListsRouter.post('/', userExtractor, async (req, res) => {
  const user = req.user;
  const { blogId, read } = req.body;

  const readingList = await ReadingList.create({
    userId: user.id,
    blogId,
    read: read || false
  });

  res.status(201).json(readingList);
});

module.exports = readingListsRouter;
