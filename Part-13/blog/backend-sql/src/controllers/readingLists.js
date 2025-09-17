const readingListsRouter = require('express').Router();
const { userExtractor } = require('../utils/middlewares');
const { ReadingList } = require('../models');

readingListsRouter.post('/', userExtractor, async (req, res) => {
  const user = req.user;
  const { blogId } = req.body;

  const readingList = await ReadingList.create({
    userId: user.id,
    blogId
  });

  res.status(201).json(readingList);
});

readingListsRouter.put('/:id', userExtractor, async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const { read } = req.body;

  const readingList = await ReadingList.findByPk(id);

  if (!readingList) {
    return res.status(404).json({ error: 'Reading List is not found' });
  }

  if (readingList.userId !== user.id) {
    return res.status(403).json({ error: 'Not your reading list' });
  }

  readingList.read = read;
  await readingList.save();

  return res.json(readingList);
});

module.exports = readingListsRouter;
