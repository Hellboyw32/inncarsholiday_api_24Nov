const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const OptionalCover = sequelize.define("OptionalCover", {
    Id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    CoverName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Amount: {
        type: Sequelize.BIGINT,
        allowNull: true
    }, 
    CoverOptions: {
        type: Sequelize.STRING,
        allowNull: false
    },

    IsValueMultiply: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    },

    IsActive: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    },
    CreatedOn: {
        type: Sequelize.DATE,
        allowNull: true
    },
    UpdatedOn: {
        type: Sequelize.DATE,
        allowNull: true
    }
}, globalOptions);

module.exports = OptionalCover;

