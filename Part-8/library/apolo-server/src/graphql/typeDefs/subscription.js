const { gql } = require('graphql-tag');

module.exports = gql`
  type Subscription {
    bookAdded: Book!
  }
`;