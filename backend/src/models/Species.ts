const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Species = sequelize.define('Species', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  scientific_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  common_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  family: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  light_needs: {
    type: DataTypes.STRING,
    allowNull: true
  },
  watering_frequency: {
    type: DataTypes.STRING,
    allowNull: true
  },
  soil_type: {
    type: DataTypes.STRING,
    allowNull: true
  },
  climate_adaptation: {
    type: DataTypes.STRING,
    allowNull: true
  },
  toxicity_level: {
    type: DataTypes.STRING,
    allowNull: true
  },
  care_difficulty: {
    type: DataTypes.STRING,
    allowNull: true
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'species',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Species;
