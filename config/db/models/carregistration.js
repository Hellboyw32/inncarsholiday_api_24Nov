const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const CarRegistration = sequelize.define(
  "CarRegistration",
  {
    Id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    CarTypeId: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    VenderId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    CarModelId: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    PlateNo: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    ImageType: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    LargeImageType: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    SmallImageType: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    IsActive: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
    IsFeatured: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
    CreatedOn: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    UpdatedOn: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    IsInStock: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
    IsBestSeller: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
    IsExcellentDeal: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
    IsRecommended: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
    WhyRecommendedText: {
      type: Sequelize.STRING,
      allowNull: true
    },
    ComissionPercentage: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    InsuranceTypeId: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  },
  globalOptions
);

module.exports = CarRegistration;
