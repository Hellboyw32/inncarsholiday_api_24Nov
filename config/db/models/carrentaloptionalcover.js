const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const CarRentalOptionalCover = sequelize.define("CarRentalOptionalCover", {
    Id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    CarRentalId: {
        type: Sequelize.BIGINT,
        allowNull: false
    },
    OptionalCoverId: {
        type: Sequelize.BIGINT,
        allowNull: false
    },
    OptionalValue: {
        type: Sequelize.STRING,
        allowNull: true
    },
    Amount: {
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
    },
    UpdatedOn: {
        type: Sequelize.DATE,
        allowNull: true
    }
}, globalOptions);

module.exports = CarRentalOptionalCover;
