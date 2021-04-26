const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const CarRental = sequelize.define(
  "CarRental",
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
    BookingFrom: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    BookingTo: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    TimeFrom: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    TimeTo: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    PickUpLocationId: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    DropOffLocationId: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    BookingAmount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    },
    AmountPaid: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    },
    BookedById: {
      type: Sequelize.BIGINT,
      allowNull: true,
    },

    PaymentStatusId: {
      type: Sequelize.BIGINT,
      allowNull: true,
    },
    BookedStatusId: {
      type: Sequelize.BIGINT,
      allowNull: true,
    },
    IsActive: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
    CreatedOn: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: new Date()
    },
    UpdatedOn: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: new Date()
    },
    IncludeCoverage: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
    BookingId: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    AgencyBookingId: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    AgencyId: {
      type: Sequelize.BIGINT,
      allowNull: true,
    },
    Invoice: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    CarRentalPriceId: {
      type: Sequelize.BIGINT,
      allowNull: true,
    },
  },
  globalOptions
);

module.exports = CarRental;
