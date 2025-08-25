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

const env = cleanEnv(process.env, {
  // On Fly.io default port is 8080
  PORT: port({ default: 8080 }),

  MONGODB_URI: mongoUri(),
  DEV_MONGODB_URI: mongoUri(),
  TEST_MONGODB_URI: mongoUri(),

  SECRET: nonEmptyStr(),
  TEST_SECRET: nonEmptyStr(),

  DB_NAME: str({ default: '' }),
  DEV_DB_NAME: str({ default: '' }),
  TEST_DB_NAME: str({ default: '' }),
});

function getMongoUri() {
  switch (process.env.NODE_ENV) {
    case 'test':
      return env.TEST_MONGODB_URI;
    case 'development':
      return env.DEV_MONGODB_URI;
    default:
      return env.MONGODB_URI;
  }
}

function getDbName() {
  switch (process.env.NODE_ENV) {
    case 'test':
      return env.TEST_DB_NAME ?? env.DB_NAME;
    case 'development':
      return env.DEV_DB_NAME ?? env.DB_NAME;
    default:
      return env.DB_NAME;
  }
}

module.exports = {
  PORT: env.PORT,
  MONGODB_URI: getMongoUri(),
  MONGODB_DB_NAME: getDbName(),
  SECRET: env.SECRET,
  TEST_SECRET: env.TEST_SECRET,
};