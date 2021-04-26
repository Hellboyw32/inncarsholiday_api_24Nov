const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const ContactRevert = sequelize.define(
  "contactrevert",
  {
    Id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    ContactUsId: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    From: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    CC: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    To: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    Message: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    CreatedOn: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW
    },
    Subject: {
      type: Sequelize.STRING,
      allowNull: true
    },
  },
  globalOptions
);

module.exports = ContactRevert;
