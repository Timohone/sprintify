const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserStory = sequelize.define('UserStory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  storyPoints: {
    type: DataTypes.FLOAT
  },
  priority: {
    type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'),
    defaultValue: 'Medium'
  },
  status: {
    type: DataTypes.ENUM('To Do', 'In Progress', 'Done'),
    defaultValue: 'To Do'
  },
  assigneeId: {
    type: DataTypes.UUID
  },
  sprintId: {
    type: DataTypes.UUID
  },
  projectId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  jiraKey: {
    type: DataTypes.STRING
  },
  jiraId: {
    type: DataTypes.STRING
  },
  epicKey: {
    type: DataTypes.STRING
  },
  storyType: {
    type: DataTypes.STRING
  },
  sprintAssignedAt: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'user_stories',
  timestamps: true
});

module.exports = UserStory;
