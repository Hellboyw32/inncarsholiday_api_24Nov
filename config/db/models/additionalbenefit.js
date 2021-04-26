const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const AdditionalBenefit = sequelize.define("AdditionalBenefit", {
  Id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  Description: {
    type: Sequelize.STRING,
    allowNull: true
  },
  DescriptionFrench: {
    type: Sequelize.STRING,
    allowNull: true
  },
  IsActive: {
    type: Sequelize.BOOLEAN,
    allowNull: true
  },
}, globalOptions)

module.exports = AdditionalBenefit;
