const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const LocalityFaq = sequelize.define("LocalityFaq", {
  Id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  LocalityId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  Question: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  Answer: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  Status: {
    type: Sequelize.STRING,
	defaultValue: "active"//active,deactive,deleted
  },
  CreatedOn: {
    type: Sequelize.DATE,
    allowNull: false,
	defaultValue: Sequelize.NOW
  },
  UpdatedOn: {
    type: Sequelize.DATE,
    allowNull: false,
	defaultValue: Sequelize.NOW
  }
},globalOptions);

module.exports = LocalityFaq;
