const { mergeTypeDefs } = require('@graphql-tools/merge');
const bookType = require('./bookType');
const authorType = require('./authorType');
const query = require('./query');
const mutation = require('./mutation');

const typeDefs = mergeTypeDefs([
  bookType,
  authorType,
  query,
  mutation
]);

module.exports = typeDefs;
