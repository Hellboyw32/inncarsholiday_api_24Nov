const globalObj = require("../global/global-import");
const sequelize=globalObj.sequelize;
const Sequelize= globalObj.Sequelize;
const globalOptions=globalObj.SequelizeGlobalOptions;

const ConfigChargeRate= sequelize.define("ConfigChargeRate",{
    Id:{
        type:Sequelize.BIGINT,
        primaryKey:true,
        autoIncrement: true
    },
    Name:{
        type:Sequelize.STRING,
        allowNull: true
    },
    Rate:{
        type:Sequelize.TEXT,
        allowNull: true
    },
    IsActive:{
        type:Sequelize.BOOLEAN,
        allowNull: true
    }
},globalOptions);

module.exports=ConfigChargeRate;
