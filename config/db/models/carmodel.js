const globalObj = require("../global/global-import");
const sequelize=globalObj.sequelize;
const Sequelize= globalObj.Sequelize;
const globalOptions=globalObj.SequelizeGlobalOptions;

const CarModel= sequelize.define("CarModel",{
    Id:{
        type:Sequelize.BIGINT,
        primaryKey:true,
        autoIncrement: true
    },
    Name:{ 
        type:Sequelize.STRING,
        allowNull: true
    },
    CarMakeId:{
        type:Sequelize.BIGINT,
        allowNull:false
    },
    Capacity:{
        type:Sequelize.BIGINT,
        allowNull: true
    },
    Doors:{
        type:Sequelize.BIGINT,
        allowNull: true
    },
    Capacity:{
        type:Sequelize.BIGINT,
        allowNull: true
    },
    TransmissionTypeId:{
        type:Sequelize.BIGINT,
        allowNull:true
    },
    BigPieceLuggage:
    {
      type:Sequelize.BIGINT,
        allowNull:true
    },
    SmallPieceLuggage:
    {
      type:Sequelize.BIGINT,
        allowNull:true
    },
    IsActive:{
        type:Sequelize.BOOLEAN,
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
},globalOptions);

module.exports=CarModel;