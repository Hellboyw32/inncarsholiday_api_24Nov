const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const FaqHelpStat = sequelize.define(
  "faqhelpstat",
  {
    Id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    IpAddress: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    Like: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
    QnaId: {
      type: Sequelize.BIGINT,
      allowNull: true,
    },
    Description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    CreatedOn: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: new Date()
    },
  },
  globalOptions
);

module.exports = FaqHelpStat;
