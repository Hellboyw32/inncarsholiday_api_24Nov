const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const DealSummery = sequelize.define("DealSummery", {
    Id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    }
    ,
    DealId: {
        type: Sequelize.BIGINT,
        allowNull: true
    }
    ,
    CarRegistrationId: {
        type: Sequelize.BIGINT,
        allowNull: true
    },
    IsActive: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    }
}, globalOptions);

module.exports = DealSummery;

