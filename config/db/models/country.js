const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const Country = sequelize.define("Country", {
  Id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  Name: {
    type: Sequelize.STRING,
    allowNull: true
  },
  CountryCode: {
    type: Sequelize.STRING,
    allowNull: true
  },
  AvailableForDriver: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  IsActive: {
    type: Sequelize.BOOLEAN,
    allowNull: true
  },
  CreatedOn: {
    type: Sequelize.DATE,
    allowNull: true
  },
  UpdatedOn: {
    type: Sequelize.DATE,
    allowNull: true
  },
   PostCode: {
    type: Sequelize.STRING,
    allowNull: true,
  }
}, globalOptions)

module.exports = Country;
