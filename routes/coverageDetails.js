var express = require("express");
const {
  CoverageDetail,
  CoverageType,
} = require("../config/database");
var router = express.Router();
const Op = require("sequelize").Op;


//all CoverageDetails by paging
router.get('/paging/all', function (request, response) {
  var pageSize = request.query.page_size;
  var page = request.query.page;
  var result = { returnCode: 0, count: 0, data: null, returnMessage: "" };

  CoverageDetail.findAndCountAll({
    where: { IsActive: true }, include:
      [{ model: CoverageType }],
    order: [['CreatedOn', 'DESC']]
  }).then(CoverageDetail => {
    result.count = CoverageDetail.rows.length;
    result.data = CoverageDetail.rows.slice((page - 1) * pageSize, page * pageSize);
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

//all CoverageDetails
router.get('/', function (request, response) {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: ""
  };
  CoverageDetail.findAll({
    where: { IsActive: true },
    include: [{
      model: CoverageType
    }]
  }).then(CoverageDetail => {
    result.data = CoverageDetail;
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

//Get CoverageDetail by name
router.get('/byname', (_req, _res) => {

  var result = { returnCode: 0, data: null, returnMessage: "" };
  CoverageDetail.findAll({
    where: { Name: { [Op.like]: '' + _req.query.name + '%' } }
  }).then(data => {
    result.data = data;
    _res.json(result);
  }).catch(err => {
    _res.send(err);
  });
});


// Get CoverageDetail By Id
router.get('/:id', function (request, response) {

  var result = {
    returnCode: 0,
    data: null,
    returnMessage: ""
  };
  CoverageDetail.findByPk(request.params.id).then(CoverageDetail => {
    if (CoverageDetail != null) {
      result.returnCode = 1;
      result.returnMessage = "success";
      result.data = CoverageDetail;
    }
    else {
      result.returnMessage("CoverageDetail not found");
    }
    response.json(result);

  }).catch(err => {
    result.returnCode = -1;
    result.returnMessage = "server error";
    response.json(result);
  })
});


// Add CoverageDetail
router.post("/create", function (request, response) {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: ""
  };
  CoverageDetail.create(request.body).then(CoverageDetail => {
    result.data = CoverageDetail;
    result.returnMessage = "Success";
    response.json(result);
  }).catch(err => {
    result.returnCode = -1;
    result.returnMessage = "Server Error";
    response.json(result);
  })
});
//update CoverageDetail
router.put("/update/:id", function (request, response) {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: "",
  };
  console.log("update");
  CoverageDetail.findByPk(request.params.id)
    .then((CoverageDetail) => {
      console.log(CoverageDetail);
      if (CoverageDetail != null) {
        CoverageDetail.Name = request.body.Name;
        CoverageDetail.NameFrench = request.body.NameFrench;
        CoverageDetail.save().then(() => {
          result.data = CoverageDetail;
          result.returnMessage = "Success";
          response.json(result);
        });
      } else {
        result.returnCode = -1;
        result.returnMessage = "CoverageDetail not found";
        response.json(result);
      }
    })
    .catch((err) => {
      response.send(err);
    });
});

//delete CoverageDetail
router.post("/delete/:id", function (request, response) {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: ""
  };
  CoverageDetail.findByPk(request.params.id).then(CoverageDetail => {
    if (CoverageDetail != null) {
      CoverageDetail.IsActive = false;
      CoverageDetail.save().then(() => {
        result.data = true;
        result.returnMessage = "Success";
        response.json(result);
      }).catch(err => {
        result.returnCode = -1;
        result.returnMessage = "Server Error";
        response.json(result);
      })
    }
  }).catch(err => {
    result.returnCode = -1;
    result.returnMessage = "Server Error";
    response.json(result);
  })
});

router.get('/getby/CoverageDetails', (_req, _res) => {

  var result = {
    returnCode: 0,
    data: null,
    returnMessage: ""
  };
  CoverageDetail.findAll({
    where: {
      Id: _req.query.CoverageDetailsID.split(",")
    }
  }).then(data => {
    result.data = data;
    _res.json(result);
  }).catch(err => {
    _res.send(err);
    //return basicOperations.MakeErrorResultObject(basicOperations.StatusCodes.CODE404, null, basicOperations.STRINGS.SERVER_ERROR);
  });
});

module.exports = router;
