const { Sequelize } = require('sequelize');
const { DATABASE_URL } = require('../utils/config');

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;