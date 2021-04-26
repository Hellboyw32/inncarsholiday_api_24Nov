const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const MetaData = sequelize.define("MetaData", {
    Id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    PageId: {
        type: Sequelize.BIGINT,
        allowNull: true
    },
    TagId: {
        type: Sequelize.BIGINT,
        allowNull: true
    },
    Content: {
        type: Sequelize.STRING,
        allowNull: true
    },
    IsActive: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    }
}, globalOptions)

module.exports = MetaData;
