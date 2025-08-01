const { GraphQLScalarType, Kind } = require('graphql');

module.exports = (name, description, validate, expectedKind = Kind.STRING) =>
  new GraphQLScalarType({
    name,
    description,
    serialize: validate,
    parseValue: validate,
    parseLiteral: (ast) => {
      if (ast.kind !== expectedKind) {
        throw new Error(`${name} must be a ${expectedKind.toLowerCase()} literal`);
      }
      const value = expectedKind === Kind.INT ? parseInt(ast.value, 10) : ast.value;
      return validate(value);
    },
  });
