const { gql } = require('graphql-tag');

module.exports = gql`
  type Book {
    id: ObjectID!
    title: String!
    published: Year!
    author: Author!
    genres: [Genre!]!
  }

  type BookEdge {
    node: Book!
    cursor: ObjectID!
  }

  type PageInfo {
    endCursor: ObjectID
    hasNextPage: Boolean!
  }

  type BookConnection {
    edges: [BookEdge!]!
    pageInfo: PageInfo!
  }
`;