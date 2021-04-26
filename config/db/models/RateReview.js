const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const RateReview = sequelize.define("RateReview", {
    Id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    VendorId: {
        type: Sequelize.BIGINT,
        allowNull: true
    },
    Rating: {
        type: Sequelize.BIGINT,
        allowNull: true
    },
    Description: {
        type: Sequelize.STRING,
        allowNull: true
    },
    CarRentalId: {
        type: Sequelize.BIGINT,
        allowNull: true
    },
    IsActive: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    },
    Date: {
        type: Sequelize.DATE,
        allowNull: true
    }
}, globalOptions);

module.exports = RateReview;