var express = require("express");
const {
  AdditionalBenefit,
} = require("../config/database");
var router = express.Router();
const Op = require("sequelize").Op;

//All Includes
router.get("/", function (request, response) {
  debugger
  var result = { returnCode: 0, data: null, returnMessage: "" };
  AdditionalBenefit.findAll({order:[['Id', 'ASC']], where: {IsActive: true}}).then(includes => {
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

  debugger
  var pageSize = request.query.page_size;
  var page = request.query.page;
  var result = { returnCode: null, count: 0, data: null, returnMessage: "" };

  AdditionalBenefit.findAndCountAll({
    where: { IsActive: true },
    order: [['Id', 'DESC']]
  }).then(res => {
    result.count = res.rows.length;
    result.data = res.rows.slice((page - 1) * pageSize, page * pageSize);
    result.returnCode = 0;
    result.returnMessage = "Success";
    response.json(result);
  }).catch(error => {
    debugger
    result.returnCode = -1;
    result.returnMessage = "Server Error";
    response.json(result);
    return;
  });
});



// Get includes By Id
router.get('/:id', function (request, response) {
  debugger
    var result = { returnCode: 0, data: null, returnMessage: "" };
    AdditionalBenefit.findByPk(request.params.id).then(data=>{
        if (data!=null)
        {
            result.returnMessage="success";
            result.returnCode=1;
            result.data=data;
            response.json(result);
        }
        else
        {
            result.returnMessage="Data not found";
            response.json(result);
        }

    }).catch(err=>{
        result.returnMessage="server error";
        result.returnCode=-1;
        response.json(result);

    })

});


// Add includes
router.post("/create", function (request, response) {

  var result = { returnCode: 0, data: null, returnMessage: "" };
  AdditionalBenefit.create(request.body).then(includes => {

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

  var result = { returnCode:null, data: null, returnMessage: "" };
  AdditionalBenefit.findByPk(request.params.id).then(includes => {
    debugger
    if (includes != null) {
      includes.Id = request.params.id;
      includes.Description = request.body.Description;
      includes.DescriptionFrench = request.body.DescriptionFrench;
      includes.save().then(() => {
      result.data = includes.Description;
      result.returnMessage = "Success"
      result.returnCode=0;
      response.json(result);
     })
    }
    else {
      result.returnCode = -1;
      result.returnMessage = "Data not found";
      response.json(result);
    }
  }).catch(err => {
    response.send(err);
  });
});

router.post("/harddelete/:id", function (request, response) {

  var result = { returnCode: 0, data: null, returnMessage: "" };
  AdditionalBenefit.destroy({ where: { Id: request.params.id } }).then(result => {
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

  var result = { returnCode: null, data: null, returnMessage: "" };
  AdditionalBenefit.findByPk(request.params.id).then(includes => {
    if (includes != null) {
    includes.IsActive=false;
     includes.save();
      result.data = includes;
      result.returnMessage = "Success"
      result.returnCode=0;
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
  AdditionalBenefit.findAll({
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
