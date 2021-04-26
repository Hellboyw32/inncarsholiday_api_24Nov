const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const CarRegistrationLabel = sequelize.define(
  "carregistrationlabel",
  {
    Id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    CarRegistrationId: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    CarPageLabelId: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
  },
  globalOptions
);

module.exports = CarRegistrationLabel;
