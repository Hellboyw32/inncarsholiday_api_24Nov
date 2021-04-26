const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const InvoiceConfig = sequelize.define(
  "invoiceconfig",
  {
    Id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    TypeId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    Text: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  globalOptions
);

module.exports = InvoiceConfig;
