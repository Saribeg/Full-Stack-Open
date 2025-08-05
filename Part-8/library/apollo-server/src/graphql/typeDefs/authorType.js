const { gql } = require('graphql-tag');

module.exports = gql`
  type Author {
    id: ObjectID!
    name: String!
    born: Year
    bookCount: Int
  }
`;
