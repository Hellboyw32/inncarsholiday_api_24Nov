const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const Sliders = sequelize.define("sliders", {
  Id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  ImagePath: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  FromDateTime: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  ToDateTime: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  IsActive: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  }
},globalOptions);

module.exports = Sliders;
