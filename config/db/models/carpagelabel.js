const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const CarPageLabel = sequelize.define(
  "carpagelabel",
  {
    Id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    TypeId: {
      type: Sequelize.BIGINT,
      allowNull: true,
    },
    Text: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    // TextFrench: {
    //   type: Sequelize.STRING,
    //   allowNull: true,
    // },
    ColorCode: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    IsActive: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
  },
  globalOptions
);

module.exports = CarPageLabel;
