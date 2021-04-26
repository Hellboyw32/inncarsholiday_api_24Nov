const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const hometexts = sequelize.define(
  "hometexts",
  {
    Id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    TypeId: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    UpperTextEnglish: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    LowerTextEnglish: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    UpperTextFrench: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    LowerTextFrench: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    IsActive: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
  },
  globalOptions
);

module.exports = hometexts;
