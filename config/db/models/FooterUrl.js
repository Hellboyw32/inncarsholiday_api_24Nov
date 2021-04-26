const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const FooterUrl = sequelize.define("FooterUrl", {
    Id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    FooterHeaderId: {
        type: Sequelize.BIGINT,
        allowNull: false
    },
    Name: {
        type: Sequelize.STRING,
        allowNull: true
    },
    Url: {
        type: Sequelize.STRING,
        allowNull: true
    },
    IsActive: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    }
}, globalOptions);

module.exports = FooterUrl;
