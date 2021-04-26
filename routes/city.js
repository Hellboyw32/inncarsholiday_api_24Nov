var express = require("express");
const {
  City,
  Country,
} = require("../config/database");
var router = express.Router();
const Op = require("sequelize").Op;


//all cities by paging
router.get('/paging/all', function (request, response) {

   
  var pageSize = request.query.page_size;
  var page = request.query.page;
  var result = { returnCode: 0, count: 0, data: null, returnMessage: "" };
  
  City.findAndCountAll({
    where: { IsActive: true }, include:
      [{ model: Country }],
    order: [['CreatedOn', 'DESC']]
  }).then(city => {
    result.count = city.rows.length;
    result.data = city.rows.slice((page - 1) * pageSize, page * pageSize);
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

//all cities
router.get('/', function (request, response) {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: ""
  };
  City.findAll({
    where: { IsActive: true },
    include: [{
      model: Country
    }]
  }).then(city => {
    result.data = city;
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

//Get city by name
router.get('/byname', (_req, _res) => {
  
  var result = { returnCode: 0, data: null, returnMessage: "" };
  City.findAll({
    where: { Name: { [Op.like]: '' + _req.query.name + '%' } }
  }).then(data => {
    result.data =data;
    _res.json(result);
  }).catch(err => {
    _res.send(err);
  });
});
 
//get city by countryid

router.get('/countryid/:id', (_req, _res) => {
  
  City.findAll({
    where: {
      countryId: _req.params.id 
    },
    include: [{
      model: Country
    }],
    order:[  ['Name', 'ASC']]
  }).then(data => {
    _res.json(data);
  }).catch(err => {
    _res.send(err);
  });
});

router.get('/countries', (_req, _res) => {
  
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: ""
  };
  City.findAll({
    where: {
      countryId: _req.query.countries.split(",")
    },
    order:[  ['Name', 'ASC']]
  }).then(data => {
    result.data = data;
    _res.json(result);
  }).catch(err => {
   
  });
});

// Get city By Id
router.get('/:id', function (request, response) {
  
    var result = {
        returnCode: 0,
        data: null,
        returnMessage: ""
      };
  City.findByPk(request.params.id).then(city=>{
      if(city!=null)
      {
          result.returnCode=1;
          result.returnMessage="success";
          result.data=city; 
      }
      else{
          result.returnMessage("city not found");
      }
      response.json(result);

  }).catch(err=>{
      result.returnCode=-1;
      result.returnMessage="server error";
      response.json(result);
  })
});


// Add city
router.post("/create", function (request, response) {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: ""
  };
  City.create(request.body, {
    include: [{
      model: Country
    }]
  }).then(city => {
    result.data = city;
    result.returnMessage = "Success";
    response.json(result);
  }).catch(err => {
    result.returnCode = -1;
    result.returnMessage = "Server Error";
    response.json(result);
  })
});
//update city
router.post("/update/:id", function (request, response) {
  
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: ""
  };
  City.findByPk(request.params.id).then(city => {
    
    if (city != null) {
      city.Name = request.body.Name;
      city.CountryId = +request.body.CountryId;
      city.save();
      result.data = city;
      result.returnMessage = "Success"
    } else {
      result.returnCode = -1;
      result.returnMessage = "city not found"
    }
    response.json(result);
  }).catch(err => {
    
    response.send(err);
  });
});
//delete city
router.post("/delete/:id", function (request, response) {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: ""
  };
  City.findByPk(request.params.id).then(city => {
    if (city != null) {
      city.IsActive = false;
      city.save();
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

router.get('/getby/cities', (_req, _res) => {
  
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: ""
  };
  City.findAll({
    where: {
      Id: _req.query.citiesID.split(",")
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
