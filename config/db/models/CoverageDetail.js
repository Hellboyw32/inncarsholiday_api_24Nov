const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const CoverageDetail = sequelize.define("CoverageDetail", {
    Id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    CoverageTypeId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 1
    },
    Name: {
        type: Sequelize.STRING,
        allowNull: true
    },
    NameFrench: {
        type: Sequelize.STRING,
        allowNull: true
    },
    Description: {
        type: Sequelize.STRING,
        allowNull: true
    },
    IsActive: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true
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

module.exports = CoverageDetail;

