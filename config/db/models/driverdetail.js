const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const DriverDetail = sequelize.define("DriverDetail", {
    Id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    CarRentalId: {
        type: Sequelize.BIGINT,
        allowNull: false
    },
    UserId: {
        type: Sequelize.BIGINT,
        allowNull: true
    },
    FirstName: {
        type: Sequelize.STRING,
        allowNull: true
    },
    LastName: {
        type: Sequelize.STRING,
        allowNull: true
    },
    AddressLine1: {
        type: Sequelize.STRING,
        allowNull: true
    },
    AddressLine2: {
        type: Sequelize.STRING,
        allowNull: true
    },
    CountryId: {
        type: Sequelize.BIGINT,
        allowNull: true
    },
    Email:
    {
        type: Sequelize.STRING,
        allowNull: true
    },
    PhoneNumber:
    {
        type: Sequelize.STRING,
        allowNull: true
    },
    IsDriverAgeDesired:
    {
        type: Sequelize.BOOLEAN,
        allowNull: true
    },

    FlightNumber:
    {
        type: Sequelize.STRING,
        allowNull: true
    },
    IsActive: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    },
    CreatedOn: {
        type: Sequelize.DATE,
        allowNull: true
    },
    UpdatedOn: {
        type: Sequelize.DATE,
        allowNull: true
    }
}, globalOptions);

module.exports = DriverDetail;
