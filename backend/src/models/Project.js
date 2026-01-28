const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  jiraProjectKey: {
    type: DataTypes.STRING
  },
  jiraBoardId: {
    type: DataTypes.STRING
  },
  jiraServerUrl: {
    type: DataTypes.STRING
  },
  jiraUsername: {
    type: DataTypes.STRING
  },
  jiraApiToken: {
    type: DataTypes.STRING
  },
  jiraConfig: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  config: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'projects',
  timestamps: true
});

Project.prototype.hasJiraConfig = function () {
  return !!(this.jiraServerUrl && this.jiraUsername && this.jiraApiToken && this.jiraProjectKey);
};

module.exports = Project;
