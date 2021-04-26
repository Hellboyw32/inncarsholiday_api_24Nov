var express = require("express");
const {
  OptionalCover,
  CarOptionalCover,
  CarRegistration,
  CarModel
} = require("../config/database");
var router = express.Router();
const Op = require("sequelize").Op; 

//All Countries
router.get("/", function (request, response) {
  debugger
  var result = { returnCode: 0, data: null, returnMessage: "" };
  CarOptionalCover.findAll({where:{IsActive:true} ,include:[{model:OptionalCover},{model:CarRegistration,include:[{model:CarModel}]}]}).then(res => {
    result.data = res;
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

//All By paging
router.get('/paging/all', function (request, response) {

  debugger 
  var pageSize = request.query.page_size;
  var page = request.query.page;
  var result = { returnCode: 0, count: 0, data: null, returnMessage: "" };
  
  CarOptionalCover.findAndCountAll({
    where: { IsActive: true },
    order: [['CreatedOn', 'DESC']],
    include:[{model:OptionalCover},{model:CarRegistration,include:{model:CarModel}}]
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




// Get  By Id
router.get('/:id', function (request, response) {
  debugger
    var result = { returnCode: 0, data: null, returnMessage: "" };
    CarOptionalCover.findByPk(request.params.id).then(data=>{
        if (data!=null)
        {
            result.returnMessage="success";
            result.returnCode=1;
            result.data=data;
            response.json(result);
        }
        else
        {
            result.returnMessage="user not find";
            response.json(result);
        }

    }).catch(err=>{
        result.returnMessage="server error";
        result.returnCode=-1;
        response.json(result);

    })
  
});


// Add 
router.post("/create", function (request, response) {
    debugger

  var result = { returnCode: 0, data: null, returnMessage: "" };
  CarOptionalCover.create(request.body).then(res => {

    result.data = res;
    result.returnMessage = "Success";
    response.json(result);
  }).catch(err => {
    result.returnCode = -1;
    result.returnMessage = "Server Error";
    response.json(result);
  })
});


//update
router.post("/update/:id", function (request, response) {
    debugger
  var result = { returnCode: 0, data: null, returnMessage: "" };
  CarOptionalCover.findByPk(request.params.id).then(res => {
    if (res != null) {
        res.CarRegistrationId=request.body.CarRegistrationId;
        res.OptionalCoverId=request.body.OptionalCoverId;
        res.IsActive=true;
        res.UpdatedOn=request.body.UpdatedOn;
      res.save();
      result.data = res;
      result.returnMessage = "Success"
    }
    else {
      result.returnCode = -1;
      result.returnMessage = "CoverOption not found"
    }
    response.json(result);
  }).catch(err => {
    response.send(err);
  });
});


//delete
router.post("/delete/:id", function (request, response) {
    var result = {
      returnCode: 0,
      data: null,
      returnMessage: ""
    };
    OptionalCover.findByPk(request.params.id).then(res => {
      if (res != null) {
        res.IsActive = false;
        res.save();
        result.data = true;
        result.returnMessage = "Success";
        response.json(result);
      }
    }).catch(err => {
      result.returnCode = -1;
      result.returnMessage = "Server Error";
      response.json(result);
    })
  });




  //get by Car Id


  router.get('/bycar/:id', function (request, response) {
    debugger
    var result = { returnCode: 0, data: null, returnMessage: "" };
  
    CarOptionalCover.findAll({where:{CarRegistrationId:request.params.id},include:[{model:OptionalCover}]}).then(res=>{
  
      if(res!=null)
      {
        result.returnCode=1; 
        result.data=res;
        result.returnMessage="successfull";
      
      }
      else
      {
        result.returnMessage="somthing wrong";
      }
      response.json(result);
  
    }).catch(err=>{
      result.returnMessage=-1;
      result.returnMessage="Server Error";
      response.json(result);
    })
  });
  

  
  module.exports = router;