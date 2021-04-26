const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const City = sequelize.define("City",{
  Id:{
    type: Sequelize.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  CountryId:{
  type:Sequelize.BIGINT,
  allowNull:false
  },
  Name:{
    type: Sequelize.STRING,
    allowNull:true
  },
  IsActive:{
    type: Sequelize.BOOLEAN,
    allowNull:true
  },
  CreatedOn: {
    type: Sequelize.DATE,
    allowNull: true
  },
  UpdatedOn: {
    type: Sequelize.DATE,
    allowNull: true
  }
},globalOptions);

module.exports = City;

