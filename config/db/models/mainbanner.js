const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const mainbanner = sequelize.define(
  "mainbanner",
  {
    Id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    ImagePath: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    Heading: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    Description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    ButtonText: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    IsActive: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
    HeadingFr: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    DescriptionFr: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    ButtonTextFr: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  globalOptions
);

module.exports = mainbanner;
