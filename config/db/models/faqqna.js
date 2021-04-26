const globalObj = require("../global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;
const globalOptions = globalObj.SequelizeGlobalOptions;

const FaqQna = sequelize.define(
  "FaqQna",
  {
    Id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Question: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    QuestionFrench: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    Answer: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    AnswerFrench: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    HeadingId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    IsActive: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
  },
  globalOptions
);

module.exports = FaqQna;
