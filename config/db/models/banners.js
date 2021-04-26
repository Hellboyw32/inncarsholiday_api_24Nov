const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const Banners = sequelize.define("Banners", {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ImagePath: {
        type: Sequelize.STRING,
    },
    PositionId: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    IsActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    }
}, globalOptions);

module.exports = Banners;
