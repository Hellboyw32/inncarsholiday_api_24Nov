const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const Deal = sequelize.define("Deal", {
    Id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    }
    ,
    From: {
        type: Sequelize.DATE,
        allowNull: true
    }
    ,
    To: {
        type: Sequelize.DATE,
        allowNull: true
    },
    Name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Cities: {
        type: Sequelize.STRING,
        allowNull: true
    }
    ,
    DiscountPercentage: {
        type: Sequelize.BIGINT,
        allowNull: true
    }
    ,
    VendorId: {
        type: Sequelize.BIGINT,
        allowNull: true
    },
    IsActive: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    },
    CreatedOn: {
        type: Sequelize.DATE,
        allowNull: true
    }
}, globalOptions);

module.exports = Deal;

