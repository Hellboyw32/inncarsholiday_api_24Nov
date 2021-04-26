var express = require("express");
const {
  ConfigChargeRate,
} = require("../config/database");
var router = express.Router();
const Op = require("sequelize").Op;

//All configRates
router.get("/", function (request, response) {
  debugger
  var result = { returnCode: 0, data: null, returnMessage: "" };
  ConfigChargeRate.findAll().then(configRates => {
    result.data = configRates;
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

//All configRates
router.get("/paging/all", function (request, response) {
  debugger
  var pageSize = request.query.page_size;
  var page = request.query.page;
  var result = { returnCode: 0, count: 0, data: null, returnMessage: "" };
search ={
  whare:{},
  order:[]
}
  if(request.query.search)
  {
    search.where = {
      Name:{ [Op.like]: request.query.search + "%" },
    } 
  }
  else{
    search.order.push(['CreatedOn','DESC']);
  }

  ConfigChargeRate.findAndCountAll(search).then(configRates => {
    debugger
   

    result.count = configRates.count;
    result.data = configRates.rows.slice((page - 1) * pageSize, page * pageSize);
   result.returnCode = 0;
    result.returnMessage = "Success";
    response.json(result);
    return;
  }).catch(error => {
    debugger
    result.returnCode = -1;
    result.returnMessage = "Server Error";
    response.json(result);
    return;
  });
});

router.get('/configRates', (request, response) => {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  ConfigChargeRate.findAll({
    where: {
      Id: request.query.configRates.split(",")
    },
    order:[['Name', 'ASC']]
    
  }).then(data => {
    result.data = data;
    response.json(result);
  }).catch(err => {
  
  });
});


// Get ConfigChargeRate By Id
router.get('/:id', function (request, response) {
  debugger
    var result = { returnCode: 0, data: null, returnMessage: "" };
    ConfigChargeRate.findByPk(request.params.id).then(data=>{
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


// Add ConfigChargeRate
router.post("/create", function (request, response) {

  var result = { returnCode: 0, data: null, returnMessage: "" };
  ConfigChargeRate.create(request.body).then(ConfigChargeRate => {

    result.data = ConfigChargeRate;
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
  ConfigChargeRate.findByPk(request.params.id).then(configRates => {
    if (configRates != null) {
      configRates.Name = request.body.Name;
      configRates.ConfigChargeRateCode = request.body.ConfigChargeRateCode;
      configRates.save();
      result.data = configRates;
      result.returnMessage = "Success"
    }
    else {
      result.returnCode = -1;
      result.returnMessage = "ConfigChargeRate not found"
    }
    response.json(result);
  }).catch(err => {
    response.send(err);
  });
});

router.post("/delete/:id", function (request, response) {

  var result = { returnCode: 0, data: null, returnMessage: "" };
  ConfigChargeRate.destroy({ where: { Id: request.params.id } }).then(ConfigChargeRate => {
    result.data = true;
    result.returnMessage = "Success";
    response.json(result);
  }).catch(err => {
    result.returnCode = -1;
    result.returnMessage = "Server Error";
    response.json(result);
  })
});


//All configRates by name
router.get("/name/all/:name", function (request, response) {
  debugger
  var result = { returnCode: 0, data: null, returnMessage: "" };
  ConfigChargeRate.findAll({ where: { Name: { [Op.like]: '' + request.params.name + '%' } } }).then(configRates => {
    debugger
    result.returnMessage = "Success";
    response.json(configRates);
    return;
  }).catch(error => {
    result.returnCode = -1;
    result.returnMessage = "Server Error";
    response.json(result);
    return;
  });
});

router.post("/ConfigChargeRateexist", function (request, response) {
  debugger
  var result = { returnCode: 0, data: null, returnMessage: "" };
  ConfigChargeRate.findOne({ where: { Name: request.body.Name, Id: { [Op.ne]: request.body.Id } } }).then(ConfigChargeRate => {
    if (ConfigChargeRate == null) {
      result.returnCode = 0;
      result.returnMessage = "ConfigChargeRate not exists";
    }
    else {
      result.returnCode = -1;
      result.returnMessage = "ConfigChargeRate already exist";
    }
    response.json(result);
  }).catch(err => {
    result.returnCode = -1;
    result.returnMessage = "Server Error";
    response.json(result);
  });
});

module.exports = router;
