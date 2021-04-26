const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const seolocationdata = sequelize.define(
    "SEOLocationData",
    {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        route: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        title: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        keywords: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        url: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        og_url: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        og_type: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        og_site_name: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        og_title: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        og_description: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        og_image: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        og_locale: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        og_localeAlternate: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        og_fbApp_id: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        twitter_card: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        twitter_site: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        twitter_title: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        twitter_description: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        twitter_image: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        CountryCode: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        Language: {
            type: Sequelize.STRING,
            allowNull: true,
        }

    },
    globalOptions
);

module.exports = seolocationdata;
