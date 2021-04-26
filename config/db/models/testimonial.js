const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const Testimonial = sequelize.define(
  "testimonial",
  {
    Id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    Rating: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    Description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    CreatedOn: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
    IsApproved: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    IsActive: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  globalOptions
);

module.exports = Testimonial;
