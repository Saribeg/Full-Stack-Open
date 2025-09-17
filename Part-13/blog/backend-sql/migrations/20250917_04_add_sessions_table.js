const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('sessions', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      hashed_refresh_token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      device_id: {
        type: DataTypes.STRING,
        allowNull: false
      },
      ip: {
        type: DataTypes.STRING,
        allowNull: true
      },
      user_agent: {
        type: DataTypes.STRING,
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    }, {
      indexes: [
        { fields: ['user_id'] },
        { fields: ['hashed_refresh_token'] },
        { fields: ['device_id'] }
      ]
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('sessions');
  },
};