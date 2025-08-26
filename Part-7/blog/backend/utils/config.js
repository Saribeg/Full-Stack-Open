const dotenv = require('dotenv');
const { cleanEnv, port, makeValidator, str } = require('envalid');

dotenv.config();

const nonEmptyStr = makeValidator((input) => {
  if (typeof input !== 'string' || input.trim() === '') {
    throw new Error('must be a non-empty string');
  }
  return input;
}, 'nonEmptyStr');

const mongoUri = makeValidator((input) => {
  if (typeof input !== 'string' || !input.startsWith('mongodb+srv://')) {
    throw new Error('must start with "mongodb+srv://"');
  }
  return input;
}, 'mongoUri');

const NODE_ENV = process.env.NODE_ENV ?? 'production';
const IS_NON_PROD = NODE_ENV === 'development' || NODE_ENV === 'test';

const baseSchema = {
  PORT: port({ default: 8080 }),
  DB_NAME: str({ default: '' }),
};

const prodSchema = {
  MONGODB_URI: mongoUri(),
  SECRET: nonEmptyStr(),
};

const nonProdSchema = {
  TEST_MONGODB_URI: mongoUri(),
  TEST_DB_NAME: str({ default: '' }),
  TEST_SECRET: nonEmptyStr(),
};

const schema = {
  ...baseSchema,
  ...(IS_NON_PROD ? nonProdSchema : prodSchema),
};

const env = cleanEnv(process.env, schema);

function getMongoUri() {
  return IS_NON_PROD ? env.TEST_MONGODB_URI : env.MONGODB_URI;
}

function getDbName() {
  return IS_NON_PROD ? env.TEST_DB_NAME ?? env.DB_NAME : env.DB_NAME;
}

module.exports = {
  NODE_ENV,
  PORT: env.PORT,
  MONGODB_URI: getMongoUri(),
  MONGODB_DB_NAME: getDbName(),
  SECRET: IS_NON_PROD ? env.TEST_SECRET : env.SECRET,
  TEST_SECRET: IS_NON_PROD ? env.TEST_SECRET : undefined,
};