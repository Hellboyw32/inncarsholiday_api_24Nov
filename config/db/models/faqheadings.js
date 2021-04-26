const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const FaqHeadings = sequelize.define("FaqHeadings", {
  Id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  Heading: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  HeadingFrench: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  IsActive: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  }
},globalOptions);

module.exports = FaqHeadings;
