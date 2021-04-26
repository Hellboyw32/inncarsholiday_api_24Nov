const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const CoverageType = sequelize.define("CoverageType", {
  Id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  Name: {
    type: Sequelize.STRING,
    allowNull: true
  },
  Price: {
    type: Sequelize.BIGINT,
    allowNull: true
  },
  CoverageHeading: {
    type: Sequelize.STRING,
    allowNull: true
  },
  CoverageDescription: {
    type: Sequelize.STRING,
    allowNull: true
  },
  Link: {
    type: Sequelize.STRING,
    allowNull: true
  },
  LinkDescription: {
    type: Sequelize.STRING  ,
    allowNull: true
  },
  NameFrench: {
    type: Sequelize.STRING,
    allowNull: true
  },
  CoverageHeadingFrench: {
    type: Sequelize.STRING,
    allowNull: true
  },
  CoverageDescriptionFrench: {
    type: Sequelize.STRING,
    allowNull: true
  },
  LinkFrench: {
    type: Sequelize.STRING,
    allowNull: true
  },
  LinkDescriptionFrench: {
    type: Sequelize.STRING  ,
    allowNull: true
  },
  IsActive: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
    defaultValue: true
  },
  CreatedOn: {
    type: Sequelize.DATE,
    allowNull: true
  },
  UpdatedOn: {
    type: Sequelize.DATE,
    allowNull: true
  },
}, globalOptions)

module.exports = CoverageType;
