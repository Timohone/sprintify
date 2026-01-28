const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Sprint = sequelize.define('Sprint', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  projectId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE
  },
  endDate: {
    type: DataTypes.DATE
  },
  goal: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.ENUM('planning', 'active', 'completed'),
    defaultValue: 'planning'
  },
  velocityTarget: {
    type: DataTypes.FLOAT
  },
  actualVelocity: {
    type: DataTypes.FLOAT
  },
  burndownData: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  jiraSprintId: {
    type: DataTypes.STRING
  },
  state: {
    type: DataTypes.STRING
  },
  completeDate: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'sprints',
  timestamps: true
});

module.exports = Sprint;
