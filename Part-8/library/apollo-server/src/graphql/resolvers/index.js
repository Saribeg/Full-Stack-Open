const { GraphQLObjectID, GraphQLJWT } = require('graphql-scalars');
const scalars = require('../scalars');
const Query = require('./query');
const Mutation = require('./mutation');
const Subscription = require('./subscription');
const Author = require('./author');

module.exports = {
  ObjectID: GraphQLObjectID,
  JWT: GraphQLJWT,
  Year: scalars.Year,
  Username: scalars.Username,
  Password: scalars.Password,
  Genre: scalars.Genre,
  Query,
  Mutation,
  Subscription,
  Author
};
