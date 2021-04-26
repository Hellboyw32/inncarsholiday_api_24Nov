const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const locality = sequelize.define(
  "locality",
  {
    Id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    CityId: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    Name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    Address: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    IsActive: {
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
    IsDropOff: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
    IsPickUp: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
    IsTopDestination: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
    IsPopularDestination: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
    TypeId: {
      type: Sequelize.BIGINT,
      allowNull: true,
    },
    Surcharge: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    Long: {
      type: Sequelize.DECIMAL,
      allowNull: false,
    },
    Lat: {
      type: Sequelize.DECIMAL,
      allowNull: false,
    },
    PickUpMetaId  : {
      type: Sequelize.BIGINT,
      allowNull: true,
    },
    DropoffMetaId: {
      type: Sequelize.BIGINT,
      allowNull: true,
    },
    Slug: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    heading_h1: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    Heading_sub_text: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    Description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    CountryCode: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    Language: {
      type: Sequelize.STRING,
      allowNull: true,
    }
  },
  globalOptions
);

module.exports = locality;
