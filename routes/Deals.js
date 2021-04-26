var express = require("express");
const {
    Deal,
    DealSummery,
} = require("../config/database");

var router = express.Router();
const Op = require("sequelize").Op;
var Sequelize = require("sequelize");


module.exports = router;
