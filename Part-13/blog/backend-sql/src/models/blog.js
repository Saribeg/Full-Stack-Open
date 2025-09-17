const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../utils/db');

class Blog extends Model {}

Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.STRING
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      isInt: {
        msg: 'likes must be an integer'
      }
    }
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: {
        args: 1991,
        msg: 'Year must be 1991 or later'
      },
      max: {
        args: new Date().getFullYear(),
        msg: `Year cannot be greater than ${new Date().getFullYear()}`
      }
    }
  }
},
{
  sequelize,
  modelName: 'blog',
  timestamps: true,
  underscored: true
});

module.exports = Blog;