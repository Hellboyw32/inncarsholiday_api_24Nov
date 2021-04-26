const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const VendorPayment = sequelize.define("VendorPayment", {
    Id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    CarRentalId: {
        type: Sequelize.BIGINT,
        allowNull: false
    },
    UpFrontPaid: {
        type: Sequelize.BIGINT,
        allowNull: true
    },
    Commission: {
        type: Sequelize.BIGINT,
        allowNull: true
    },
    DueAmount: {
        type: Sequelize.BIGINT,
        allowNull: true
    },
    IsActive: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    }
}, globalOptions);

module.exports = VendorPayment;
