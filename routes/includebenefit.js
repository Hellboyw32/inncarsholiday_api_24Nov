var express = require("express");
const {
  InculdeBenefit,
} = require("../config/database");
var router = express.Router();
const Op = require("sequelize").Op;

//All Includes
router.get("/", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  InculdeBenefit.findAll({ order: [['Id', 'ASC']], where: { IsActive: true } }).then(includes => {
    result.data = includes;
    result.returnMessage = "Success";
    response.json(result);
    return;
  }).catch(error => {
    result.returnCode = -1;
    result.returnMessage = "Server Error";
    response.json(result);
    return;
  });
});

//All Includes
router.get('/paging/all', function (request, response) {


  var pageSize = request.query.page_size;
  var page = request.query.page;
  var result = { returnCode: 0, count: 0, data: null, returnMessage: "" };

  InculdeBenefit.findAndCountAll({
    where: { IsActive: true },
    order: [['Id', 'DESC']]
  }).then(res => {
    result.count = res.rows.length;
    result.data = res.rows.slice((page - 1) * pageSize, page * pageSize);
    result.returnCode = 0;
    result.returnMessage = "Success";
    response.json(result);
  }).catch(error => {

    result.returnCode = -1;
    result.returnMessage = "Server Error";
    response.json(result);
    return;
  });
});

// Get includes By Id
router.get('/:id', function (request, response) {

  var result = { returnCode: 0, data: null, returnMessage: "" };
  InculdeBenefit.findByPk(request.params.id).then(data => {
    if (data != null) {
      result.returnMessage = "success";
      result.returnCode = 1;
      result.data = data;
      response.json(result);
    }
    else {
      result.returnMessage = "Data not found";
      response.json(result);
    }

  }).catch(err => {
    result.returnMessage = "server error";
    result.returnCode = -1;
    response.json(result);

  })

});


// Add includes
router.post("/create", function (request, response) {

  var result = { returnCode: 0, data: null, returnMessage: "" };
  InculdeBenefit.create(request.body).then(includes => {

    result.data = includes;
    result.returnMessage = "Success";
    response.json(result);
  }).catch(err => {
    result.returnCode = -1;
    result.returnMessage = "Server Error";
    response.json(result);
  })
});

router.post("/update/:id", function (request, response) {

  var result = { returnCode: 0, data: null, returnMessage: "" };
  InculdeBenefit.findByPk(request.params.id).then(includes => {
    if (includes != null) {
      includes.Id = request.body.Id;
      includes.Description = request.body.Description;
      includes.DescriptionFrench = request.body.DescriptionFrench;
      includes.save().then(() => {
        result.data = includes;
        result.returnMessage = "Success";
        response.json(result);
      })
    }
    else {
      result.returnCode = -1;
      result.returnMessage = "Data not found"
      response.json(result);
    }
  }).catch(err => {
    response.send(err);
  });
});

router.post("/harddelete/:id", function (request, response) {

  var result = { returnCode: 0, data: null, returnMessage: "" };
  InculdeBenefit.destroy({ where: { Id: request.params.id } }).then(result => {
    result.data = true;
    result.returnMessage = "Success";
    response.json(result);
  }).catch(err => {
    result.returnCode = -1;
    result.returnMessage = "Server Error";
    response.json(result);
  })
});


router.post("/delete/:id", function (request, response) {

  var result = { returnCode: 0, data: null, returnMessage: "" };
  InculdeBenefit.findByPk(request.params.id).then(includes => {
    if (includes != null) {
      includes.IsActive = false;
      includes.save();
      result.data = includes;
      result.returnMessage = "Success"
    }
    else {
      result.returnCode = -1;
      result.returnMessage = "Data not found"
    }
    response.json(result);
  }).catch(err => {
    response.send(err);
  });
});

router.get("/getbylang/:lang?", function (request, response) {
  let result = { returnCode: 0, data: null, returnMessage: "" };
  let queryAttributes = ["Id", "Description"];
  if (request.params.lang)
    queryAttributes = ["Id", ["DescriptionFrench", "Description"]];
    InculdeBenefit.findAll({
    order: [["Id", "ASC"]],
    where: { IsActive: true },
    attributes: queryAttributes
  })
    .then((includes) => {
      result.data = includes;
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

module.exports = router;
