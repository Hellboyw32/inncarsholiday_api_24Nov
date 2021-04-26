const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const CarRentalPrice = sequelize.define("CarRentalPrice",{
  Id:{
    type: Sequelize.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  CarRegistrationId:{
  type:Sequelize.BIGINT,
  allowNull:false
  },
  BeforeDiscountPrice:{
    type: Sequelize.BIGINT,
    allowNull:true,
    defaultValue: 0
  },
  Price:{
    type: Sequelize.BIGINT,
    allowNull:true
  },
  From: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
  To: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
  FromDay: {
    type: Sequelize.BIGINT,
    allowNull: true,
  },
  IsActive:{
    type: Sequelize.BOOLEAN,
    allowNull:true,
    defaultValue: false
  },
  CreatedOn: {
    type: Sequelize.DATE,
    allowNull: true,
    defaultValue: new Date()
  },
  UpdatedOn: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: new Date()
  }
},globalOptions);

module.exports = CarRentalPrice;
