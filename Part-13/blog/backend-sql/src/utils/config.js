require('dotenv').config();

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT || 3001,
  SECRET: process.env.SECRET,
  TEST_SECRET: process.env.TEST_SECRET,
  ACCESS_TTL: process.env.ACCESS_TTL,
  REFRESH_TTL_DAYS: Number(process.env.REFRESH_TTL_DAYS)
};