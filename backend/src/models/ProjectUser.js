const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProjectUser = sequelize.define('ProjectUser', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  projectId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'member', 'viewer'),
    defaultValue: 'member'
  }
}, {
  tableName: 'project_users',
  timestamps: true,
  indexes: [
    { unique: true, fields: ['projectId', 'userId'] }
  ]
});

module.exports = ProjectUser;
