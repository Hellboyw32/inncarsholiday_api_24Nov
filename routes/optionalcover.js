var express = require("express");
const { OptionalCover } = require("../config/database");
var router = express.Router();
const Op = require("sequelize").Op;

//All Countries
router.get("/", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  OptionalCover.findAll({ where: { IsActive: true } })
    .then((res) => {
      result.data = res;
      result.returnMessage = "Success";
      response.json(result);
      return;
    })
    .catch((error) => {
      result.returnCode = -1;
      result.returnMessage = "Server Error";
      response.json(result);
      return;
    });
});

//All By paging
router.get("/paging/all", function (request, response) {
  var pageSize = request.query.page_size;
  var page = request.query.page;
  var result = { returnCode: 0, count: 0, data: null, returnMessage: "" };

  OptionalCover.findAndCountAll({
    where: { IsActive: true },
    order: [["CreatedOn", "DESC"]],
  })
    .then((res) => {
      result.count = res.rows.length;
      result.data = res.rows.slice((page - 1) * pageSize, page * pageSize);
      result.returnCode = 0;
      result.returnMessage = "Success";
      response.json(result);
    })
    .catch((error) => {
      result.returnCode = -1;
      result.returnMessage = "Server Error";
      response.json(result);
      return;
    });
});

// Get  By Id
router.get("/:id", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  OptionalCover.findByPk(request.params.id)
    .then((data) => {
      if (data != null) {
        result.returnMessage = "success";
        result.returnCode = 1;
        result.data = data;
        response.json(result);
      } else {
        result.returnMessage = "user not find";
        response.json(result);
      }
    })
    .catch((err) => {
      result.returnMessage = "server error";
      result.returnCode = -1;
      response.json(result);
    });
});

// Add
router.post("/create", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  OptionalCover.create(request.body)
    .then((res) => {
      result.data = res;
      result.returnMessage = "Success";
      response.json(result);
    })
    .catch((err) => {
      result.returnCode = -1;
      result.returnMessage = "Server Error";
      response.json(result);
    });
});

//update
router.post("/update/:id", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  OptionalCover.findByPk(request.params.id)
    .then((res) => {
      if (res != null) {
        res.CoverName = request.body.CoverName;
        res.Amount = request.body.Amount;
        res.CoverOptions = request.body.CoverOptions;
        res.IsValueMultiply = request.body.IsValueMultiply;
        res.IsActive = true;
        res.CreatedOn = request.body.CreatedOn;
        res.UpdatedOn = request.body.UpdatedOn;
        res.save();
        result.data = res;
        result.returnMessage = "Success";
      } else {
        result.returnCode = -1;
        result.returnMessage = "CoverOption not found";
      }
      response.json(result);
    })
    .catch((err) => {
      response.send(err);
    });
});

//delete
router.post("/delete/:id", function (request, response) {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: "",
  };
  OptionalCover.findByPk(request.params.id)
    .then((res) => {
      if (res != null) {
        res.IsActive = false;
        res
          .save()
          .then(() => {
            result.data = true;
            result.returnMessage = "Success";
            response.json(result);
          })
          .catch(() => {
            result.returnCode = -1;
            result.returnMessage = "Server Error";
            response.json(result);
          });
      }
    })
    .catch((err) => {
      result.returnCode = -1;
      result.returnMessage = "Server Error";
      response.json(result);
    });
});

module.exports = router;
