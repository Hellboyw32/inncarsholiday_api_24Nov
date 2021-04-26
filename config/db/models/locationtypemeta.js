const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const LocationTypeMeta = sequelize.define(
  "locationtypemeta",
  {
    Id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    MetaIDTag: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    TypeId: {
      type: Sequelize.BIGINT,
      allowNull: true,
    },
    ServiceLabel: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    ServiceLabelFrench: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    ServiceDescription: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    ServiceDescriptionFrench: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    TimingLabel: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    TimingLabelFrench: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    TimingDescription: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    TimingDescriptionFrench: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    Instructions: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    InstructionsFrench: {
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

module.exports = LocationTypeMeta;
