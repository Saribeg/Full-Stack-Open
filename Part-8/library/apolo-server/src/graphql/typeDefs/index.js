const { mergeTypeDefs } = require('@graphql-tools/merge');
const bookType = require('./bookType');
const authorType = require('./authorType');
const userType = require('./userType');
const tokenType = require('./tokenType');
const query = require('./query');
const mutation = require('./mutation');

const typeDefs = mergeTypeDefs([
  bookType,
  authorType,
  userType,
  tokenType,
  query,
  mutation
]);

module.exports = typeDefs;
