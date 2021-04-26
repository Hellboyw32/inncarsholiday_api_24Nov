const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const HomeBanner = sequelize.define(
  "homebanners",
  {
    Id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ImagePath: {
      type: Sequelize.STRING,
    },
    LocationId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    BannerLocationId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    PositionId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    From: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    To: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    Price: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    IsActive: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
  },
  globalOptions
);

module.exports = HomeBanner;
