const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const Template = sequelize.define(
  "Template",
  {
    Id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Templatetype: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    TemplateSubject: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    SenderName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    SenderEmail: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    TemplateContent: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    IsActive: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
  },
  globalOptions
);

module.exports = Template;
