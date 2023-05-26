const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const CarType = sequelize.define("CarType", {
    Id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    Name: {
        type: Sequelize.STRING,
        allowNull: true
    },
    Image: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    LargeImage: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    SmallImage: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    IsActive: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    },
    Capacity: {
        type: Sequelize.BIGINT,
        allowNull: true
    },
    Doors: {
        type: Sequelize.BIGINT,
        allowNull: true
    },
    TransmissionTypeId: {
        type: Sequelize.BIGINT,
        allowNull: true
    },
    InsuranceTC: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    ExcessAmount: {
        type: Sequelize.BIGINT,
        allowNull: true
    },
    GuaranteeAmount: {
        type: Sequelize.BIGINT,
        allowNull: true
    },
    MinDriverAge: {
        type: Sequelize.BIGINT,
        allowNull: true
    },
    Order: {
        type: Sequelize.BIGINT,
        allowNull: true
    },
    InsuranceTC_French: {
        type: Sequelize.TEXT,
        allowNull: true
    },

}, globalOptions);

module.exports = CarType;
