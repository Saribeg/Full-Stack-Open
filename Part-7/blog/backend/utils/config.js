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

const num = makeValidator((input) => {
  const parsed = parseInt(input, 10);
  if (Number.isNaN(parsed)) {
    throw new Error('must be a number');
  }
  return parsed;
}, 'num');

function getNodeEnv() {
  return process.env.NODE_ENV ?? 'production';
}

function isTest() {
  return getNodeEnv() === 'test';
}

function isDev() {
  return getNodeEnv() === 'development';
}

function isProd() {
  return getNodeEnv() === 'production';
}

const baseSchema = {
  PORT: port({ default: 8080 }),
  DB_NAME: str({ default: '' }),
  JSON_BODY_LIMIT: str({ default: '16kb' }),
  AUTH_RATE_MAX: num({ default: 20 }),
  WRITE_RATE_MAX_PER_MIN: num({ default: 30 }),
};

const prodSchema = {
  MONGODB_URI: mongoUri(),
  SECRET: nonEmptyStr(),
};

const devSchema = {
  DEV_MONGODB_URI: mongoUri(),
  TEST_SECRET: nonEmptyStr(),
};

const testSchema = {
  TEST_MONGODB_URI: mongoUri(),
  TEST_DB_NAME: str({ default: '' }),
  TEST_SECRET: nonEmptyStr(),
};

const schema = {
  ...baseSchema,
  ...(isProd() ? prodSchema : {}),
  ...(isDev() ? devSchema : {}),
  ...(isTest() ? testSchema : {}),
};

const env = cleanEnv(process.env, schema);

function getMongoUri() {
  if (isTest()) return env.TEST_MONGODB_URI;
  if (isDev()) return env.DEV_MONGODB_URI;
  return env.MONGODB_URI;
}

function getDbName() {
  if (isTest()) return env.TEST_DB_NAME || env.DB_NAME;
  return env.DB_NAME;
}

module.exports = {
  getNodeEnv,
  isTest,
  isDev,
  isProd,
  PORT: env.PORT,
  MONGODB_URI: getMongoUri(),
  MONGODB_DB_NAME: getDbName(),
  SECRET: isProd() ? env.SECRET : env.TEST_SECRET,
  TEST_SECRET: !isProd() ? env.TEST_SECRET : undefined,
  JSON_BODY_LIMIT: env.JSON_BODY_LIMIT,
  AUTH_RATE_MAX: env.AUTH_RATE_MAX,
  WRITE_RATE_MAX_PER_MIN: env.WRITE_RATE_MAX_PER_MIN,
};