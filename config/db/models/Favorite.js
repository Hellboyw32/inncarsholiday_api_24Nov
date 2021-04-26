const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const Favorite = sequelize.define("Favorite", {
    Id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    CarRegeistrationId: {
        type: Sequelize.BIGINT,
        allowNull: false
    },
    IpAddress: {
        type: Sequelize.STRING,
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
    Email: {
        type: Sequelize.STRING,
        allowNull: true
    },
}, globalOptions);

module.exports = Favorite;

