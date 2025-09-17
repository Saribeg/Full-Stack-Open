const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../utils/db');

class ReadingList extends Model {}

ReadingList.init({
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
  blogId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'blogs', key: 'id' },
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'readinglist',
  underscored: true,
  timestamps: false
});

module.exports = ReadingList;