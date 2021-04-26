const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const aboutustext = sequelize.define(
  "aboutustexts",
  {
    Id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    PositionId: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    EnglishText: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    FrenchText: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    IsActive: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
  },
  globalOptions
);

module.exports = aboutustext;
