const { createComplexityLimitRule } = require('graphql-validation-complexity');
const { GraphQLError, print } = require('graphql');
const logger = require('../utils/logger');

const logQueryCost = ({ cost, documentNode, validationContext, exceeded = false }) => {
  try {
    const document = documentNode || validationContext?._ast;
    const operationNode = document?.definitions?.find(
      (def) => def.kind === 'OperationDefinition'
    );

    const operationType = operationNode?.operation?.toUpperCase() || 'UNKNOWN';
    const name = operationNode?.name?.value || 'Unnamed';
    const label = `${operationType} "${name}"`;

    const message = exceeded
      ? `${label} exceeded complexity limit (${cost})`
      : `${label} has cost: ${cost}`;

    const log = exceeded ? logger.error : logger.info;
    log(message);

    if (name === 'Unnamed') {
      logger.info(`Query body:\n${print(document)}`);
    }

    return { operationNode, label };
  } catch (err) {
    logger.error('Failed to log query cost info:', err);
    logger.info('Raw cost:', cost);
    return { operationNode: undefined };
  }
};

const costLimitRule = createComplexityLimitRule(1000, {
  scalarCost: 1,
  objectCost: 5,
  listFactor: 10,
  introspectionListFactor: 2,

  onCost: (cost, validationContext) => {
    if (process.env.NODE_ENV !== 'production') {
      logQueryCost({ cost, validationContext, exceeded: false });
    }
  },

  createError: (cost, documentNode) => {
    const { operationNode } = logQueryCost({ cost, documentNode, exceeded: true });

    return new GraphQLError(
      `Query complexity (${cost}) exceeds the allowed limit`,
      { nodes: operationNode ? [operationNode] : undefined }
    );
  },
});

module.exports = { costLimitRule };