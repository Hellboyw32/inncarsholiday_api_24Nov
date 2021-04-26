const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const Scripts = sequelize.define(
  "scripts",
  {
    Id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    SRC: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  globalOptions
);

module.exports = Scripts;
