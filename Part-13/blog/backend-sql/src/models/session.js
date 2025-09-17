const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../utils/db');

class Session extends Model {}

Session.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
}, {
  sequelize,
  modelName: 'session',
  underscored: true,
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['refreshToken'] }
  ]
});

module.exports = Session;