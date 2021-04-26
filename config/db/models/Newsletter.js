const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const Newsletter = sequelize.define("Newsletter", {
    Id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    IpAddress: {
        type: Sequelize.STRING,
        allowNull: true
    },
    UserId: {
        type: Sequelize.STRING,
        allowNull: true
    },
    Email: {
        type: Sequelize.STRING,
        allowNull: true
    },
    IsSubscribe: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    },
    IsActive: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    }
}, globalOptions)

module.exports = Newsletter;
