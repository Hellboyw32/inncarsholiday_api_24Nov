const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const Transaction = sequelize.define("Transaction", {
    Id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    CarRentalId: {
        type: Sequelize.BIGINT,
        allowNull: true
    },
    BookingStatusId: {
        type: Sequelize.BIGINT,
        allowNull: true
    },
    AmountPaid: {
        type: Sequelize.STRING,
        allowNull: true
    },
    PaymentStatusId: {
        type: Sequelize.BIGINT,
        allowNull: true
    },
    IsActive: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    },
    TransactionDate: {
        type: Sequelize.DATE,
        allowNull: true
    },
    AmountPaid: {
        type: Sequelize.STRING,
        allowNull: true
    },
    Payer_Id: {
        type: Sequelize.STRING,
        allowNull: true
    },
    Pay_Id: {
        type: Sequelize.STRING,
        allowNull: true
    },
    Status: {
        type: Sequelize.STRING,
        allowNull: true
    },
    State: {
        type: Sequelize.STRING,
        allowNull: true
    },
    Payer_Email: {
        type: Sequelize.STRING,
        allowNull: true
    },
}, globalOptions);

module.exports = Transaction;