const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const TransmissionTypes = sequelize.define("TransmissionTypes", {
    Id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    Name: {
        type: Sequelize.STRING,
        allowNull: true
    },
    IsActive: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    }
}, globalOptions);

module.exports = TransmissionTypes;
