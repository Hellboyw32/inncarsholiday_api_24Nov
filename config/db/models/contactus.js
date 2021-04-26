const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const ContactUs = sequelize.define(
  "contactus",
  {
    Id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    Name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    Email: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    Message: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    SentOn: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    IsActive: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
  },
  globalOptions
);

module.exports = ContactUs;
