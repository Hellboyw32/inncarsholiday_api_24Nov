const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const CountryConfig = sequelize.define(
    "countryconfig",
    {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        country: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        language: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        languageCode: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        lang: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        dir: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        flag: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        CountryName: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        IsActive:{
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },
    globalOptions
);

module.exports = CountryConfig;
