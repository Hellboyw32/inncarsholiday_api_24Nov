const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const CarBookingStats = sequelize.define("CarBookingStats", {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    BookingTimes: {
        type: Sequelize.INTEGER,
    },
    LastBookingTime: {
        type: Sequelize.DATE,
    },
    CarId: {
        type: Sequelize.INTEGER,
    },
    LookedAt: {
        type: Sequelize.INTEGER,
    },
    Date: {
        type: Sequelize.DATE,
        allowNull: false,
    }
}, globalOptions);

module.exports = CarBookingStats;
