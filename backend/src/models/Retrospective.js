const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Retrospective = sequelize.define('Retrospective', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  sprintId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true
  },
  projectId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  wentWell: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  needsImprovement: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  actionItems: {
    type: DataTypes.JSONB,
    defaultValue: []
  }
}, {
  tableName: 'retrospectives',
  timestamps: true
});

module.exports = Retrospective;
