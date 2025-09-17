const authorsRouter = require('express').Router();
const { Blog } = require('../models');
const { sequelize } = require('../utils/db');

authorsRouter.get('/', async (req, res) => {

  const authors = await Blog.findAll({
    group: 'author',
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('author')), 'articles'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
    ]
  });

  res.json(authors);
});

module.exports = authorsRouter;