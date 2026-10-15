const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserPlant = sequelize.define('UserPlant', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  species_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nickname: {
    type: DataTypes.STRING,
    allowNull: true
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  added_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'user_plants',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = UserPlant;
