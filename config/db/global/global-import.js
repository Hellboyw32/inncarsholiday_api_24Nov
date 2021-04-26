const Sequelize = require('sequelize');
let CUSTOM_NODE_ENV = 'deploy'
const globalOptions = {
  timestamps: false,
  paranoid: true,
  freezeTableName: true
};
if(CUSTOM_NODE_ENV === 'deploy') {
  //sqlConnectionobj = new Sequelize('qacarrental', 'dbuser_inncarsholiday', 'view4me_inncarsholiday', {
  sqlConnectionobj = new Sequelize('phcarrental', 'dbuser_inncarsholiday', 'view4me_inncarsholiday', {
    host: '131.153.58.69',
    dialect: 'mysql',
    logging: false,
    operatorsAliases: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
}
const sequelize = sqlConnectionobj;
const global = {
  "Sequelize": Sequelize,
  "sequelize": sequelize,
  "SequelizeGlobalOptions": globalOptions
};
module.exports = global;
