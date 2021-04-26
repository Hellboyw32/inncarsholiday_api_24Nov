const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const UserProfile = sequelize.define("UserProfile", {
  Id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  UserId: {
    type: Sequelize.INTEGER,
  },
  FirstName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  LastName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  Phone: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  City: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  Country: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  ProfilePicPath: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  IsActive: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  City: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  State: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  PostCode: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  Street1: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  Street2: {
    type: Sequelize.TEXT,
    allowNull: true,
  }
},globalOptions);

module.exports = UserProfile;
