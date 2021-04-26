const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const User = sequelize.define("User", {
  Id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  Email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  Password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  Token: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  Code: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  RoleId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  AgencyId: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  IsBlocked: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  BlockedDate: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  IsApproved: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
  },
  ApprovedDate: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  IsEmailVerified: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  EmailVerifiedDate: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  IsActive: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  CreatedOn: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  UpdatedOn: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  EmailVerificationId: {
    type: Sequelize.STRING,
    allowNull: true,
  }
  
},globalOptions);

module.exports = User;