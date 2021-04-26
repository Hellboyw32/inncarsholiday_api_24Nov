const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const VendorPaymentSummary = sequelize.define("VendorPaymentSummary", {
    Id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    TransactionID: {
        type: Sequelize.BIGINT,
        allowNull: true
    },
    AmountPaid: {
        type: Sequelize.STRING,
        allowNull: true
    },
    PaymentDate: {
        type: Sequelize.DATE,
        allowNull: true
    },
    PaymentType: {
        type: Sequelize.STRING,
        allowNull: true
    },
    PaymentMethod: {
        type: Sequelize.STRING,
        allowNull: true
    },
    VendorPaymentId: {
        type: Sequelize.BIGINT,
        allowNull: false
    },
    PaymentStatusId: {
        type: Sequelize.BIGINT,
        allowNull: false
    }
}, globalOptions);

module.exports = VendorPaymentSummary;
