const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reminder = sequelize.define('Reminder', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_plant_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING, // e.g., 'watering', 'misting', 'fertilizing', 'pruning'
    allowNull: false,
    defaultValue: 'watering'
  },
  frequency_days: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 7
  },
  next_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING, // 'pending', 'completed', 'skipped'
    allowNull: false,
    defaultValue: 'pending'
  }
}, {
  tableName: 'reminders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Reminder;
