const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CapacityPlan = sequelize.define('CapacityPlan', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  sprintId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  availableHours: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  allocatedHours: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  weeklyCapacity: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  availabilityDays: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
}, {
  tableName: 'capacity_plans',
  timestamps: true,
  indexes: [
    { unique: true, fields: ['userId', 'sprintId'] }
  ]
});

module.exports = CapacityPlan;
