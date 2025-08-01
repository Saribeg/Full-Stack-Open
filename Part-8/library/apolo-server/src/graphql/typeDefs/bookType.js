const { gql } = require('graphql-tag');

module.exports = gql`
  type Book {
    id: ObjectID!
    title: String!
    published: Year!
    author: Author!
    genres: [Genre!]!
  }
`;