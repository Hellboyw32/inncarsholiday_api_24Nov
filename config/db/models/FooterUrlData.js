const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const FooterUrlData = sequelize.define("FooterUrlData", {
    Id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    FooterUrlId: {
        type: Sequelize.BIGINT,
        allowNull: false
    },
    Data: {
        type: Sequelize.STRING,
        allowNull: true
    },
    IsActive: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    }
}, globalOptions);

module.exports = FooterUrlData;
