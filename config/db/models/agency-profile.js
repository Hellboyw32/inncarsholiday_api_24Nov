const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const AgencyProfile = sequelize.define("AgencyProfile", {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    AgencyId: {
        type: Sequelize.INTEGER,
    },
    UserId: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    Name: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    Phone: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    CityId: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    CountryId: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    LogoPath: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    Description: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    IsActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    }
}, globalOptions);

module.exports = AgencyProfile;
