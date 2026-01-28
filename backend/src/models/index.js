const sequelize = require('../config/database');
const User = require('./User');
const Project = require('./Project');
const ProjectUser = require('./ProjectUser');
const Sprint = require('./Sprint');
const UserStory = require('./UserStory');
const CapacityPlan = require('./CapacityPlan');
const Retrospective = require('./Retrospective');

// Associations
Project.belongsToMany(User, { through: ProjectUser, foreignKey: 'projectId' });
User.belongsToMany(Project, { through: ProjectUser, foreignKey: 'userId' });

ProjectUser.belongsTo(User, { foreignKey: 'userId' });
ProjectUser.belongsTo(Project, { foreignKey: 'projectId' });
User.hasMany(ProjectUser, { foreignKey: 'userId' });
Project.hasMany(ProjectUser, { foreignKey: 'projectId' });

Sprint.belongsTo(Project, { foreignKey: 'projectId' });
Project.hasMany(Sprint, { foreignKey: 'projectId' });

UserStory.belongsTo(Sprint, { foreignKey: 'sprintId' });
Sprint.hasMany(UserStory, { foreignKey: 'sprintId' });

UserStory.belongsTo(Project, { foreignKey: 'projectId' });
Project.hasMany(UserStory, { foreignKey: 'projectId' });

UserStory.belongsTo(User, { as: 'assignee', foreignKey: 'assigneeId' });
User.hasMany(UserStory, { foreignKey: 'assigneeId' });

CapacityPlan.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(CapacityPlan, { foreignKey: 'userId' });

CapacityPlan.belongsTo(Sprint, { foreignKey: 'sprintId' });
Sprint.hasMany(CapacityPlan, { foreignKey: 'sprintId' });

Sprint.hasOne(Retrospective, { foreignKey: 'sprintId' });
Retrospective.belongsTo(Sprint, { foreignKey: 'sprintId' });

Retrospective.belongsTo(Project, { foreignKey: 'projectId' });
Project.hasMany(Retrospective, { foreignKey: 'projectId' });

module.exports = {
  sequelize,
  User,
  Project,
  ProjectUser,
  Sprint,
  UserStory,
  CapacityPlan,
  Retrospective
};
