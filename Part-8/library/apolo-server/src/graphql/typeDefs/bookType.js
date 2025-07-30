const { gql } = require('graphql-tag');

module.exports = gql`
  type Book {
    id: ID!
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
  }
`;