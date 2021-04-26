const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const BookedPercentage = sequelize.define("BookedPercentage", {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Percentage: {
        type: Sequelize.INTEGER,
    },
    LocationId: {
        type: Sequelize.INTEGER,
    },
    Date: {
        type: Sequelize.DATE,
        allowNull: false,
    }
}, globalOptions);

module.exports = BookedPercentage;
