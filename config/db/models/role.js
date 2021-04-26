const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const Role = sequelize.define("Role", {
  Id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  Name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  IsActive: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  }
},globalOptions);

module.exports = Role;
