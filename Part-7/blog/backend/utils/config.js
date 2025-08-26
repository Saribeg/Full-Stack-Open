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
const isTest = NODE_ENV === 'test';
const isDev  = NODE_ENV === 'development';
const isProd = NODE_ENV === 'production';

const baseSchema = {
  PORT: port({ default: 8080 }),
  DB_NAME: str({ default: '' }),
};

const prodSchema = {
  MONGODB_URI: mongoUri(),
  SECRET: nonEmptyStr(),
};

const devSchema = {
  DEV_MONGODB_URI: mongoUri(),
  TEST_SECRET: nonEmptyStr(), // dev reuses test secret
};

const testSchema = {
  TEST_MONGODB_URI: mongoUri(),
  TEST_DB_NAME: str({ default: '' }),
  TEST_SECRET: nonEmptyStr(),
};

const schema = {
  ...baseSchema,
  ...(isProd ? prodSchema : {}),
  ...(isDev  ? devSchema  : {}),
  ...(isTest ? testSchema : {}),
};

const env = cleanEnv(process.env, schema);

function getMongoUri() {
  if (isTest) return env.TEST_MONGODB_URI;
  if (isDev)  return env.DEV_MONGODB_URI;
  return env.MONGODB_URI;
}

function getDbName() {
  if (isTest) return env.TEST_DB_NAME || env.DB_NAME;
  return env.DB_NAME;
}

module.exports = {
  NODE_ENV,
  PORT: env.PORT,
  MONGODB_URI: getMongoUri(),
  MONGODB_DB_NAME: getDbName(),
  SECRET: isProd ? env.SECRET : env.TEST_SECRET,
  TEST_SECRET: !isProd ? env.TEST_SECRET : undefined,
};