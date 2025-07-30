const { gql } = require('graphql-tag');

module.exports = gql`
  type Token {
    value: String!
  }
`;