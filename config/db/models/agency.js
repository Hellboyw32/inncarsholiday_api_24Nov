const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const Agency = sequelize.define(
  "Agency",
  {
    Id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    Name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    Phone: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    CityId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    CountryId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    LogoPath: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    Description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    IsActive: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    IsBlocked: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    Abbreviation: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    Description_French: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  globalOptions
);

module.exports = Agency;
