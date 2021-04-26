var express = require("express");
const { sequelize, fueltype } = require("../config/database");
var router = express.Router();
const Sequelize = require("sequelize");
const Op = require("sequelize").Op;

router.get("/getall", function (request, response) {
  let result = {
    data: null,
    message: "Success",
    returnCode: 1,
  };
  fueltype
    .findAll()
    .then((res) => {
      if (res) {
        result.data = res;
        response.json(result);
      }
    })
    .catch((err) => {
      result.data = err;
      response.json(result);
    });
});

module.exports = router;
