const mongoose = require('mongoose');
const DataLoader = require('dataloader');
const Book = require('../models/book');

const batchBookCounts = async (authorIds) => {
  const objectIds = authorIds.map(id => mongoose.Types.ObjectId.createFromHexString(id));

  const counts = await Book.aggregate([
    { $match: { author: { $in: objectIds } } },
    { $group: { _id: '$author', count: { $sum: 1 } } }
  ]);

  const countMap = counts.reduce((map, item) => {
    map[item._id.toString()] = item.count;
    return map;
  }, {});

  return authorIds.map(id => countMap[id] || 0);
};

const createBookCountLoader = () => new DataLoader(batchBookCounts);

module.exports = createBookCountLoader;
