var express = require("express");
const {
  Country,
} = require("../config/database");
var router = express.Router();
const Op = require("sequelize").Op;

//All Countries
router.get("/", function (request, response) {

  var result = { returnCode: 0, data: null, returnMessage: "" };
  Country.findAll({ order: [['Name', 'ASC']] }).then(countries => {
    result.data = countries;
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

//All Countries
router.get("/fordrivers", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  Country.findAll({ where: {IsActive: true, AvailableForDriver: true} }).then(countries => {
    result.data = countries;
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

//All Countries
router.get("/paging/all", function (request, response) {

  var pageSize = request.query.page_size;
  var page = request.query.page;
  var result = { returnCode: 0, count: 0, data: null, returnMessage: "" };
  search = {
    whare: {},
    order: []
  }
  if (request.query.search) {
    search.where = {
      Name: { [Op.like]: request.query.search + "%" },
    }
  }
  else {
    search.order.push(['CreatedOn', 'DESC']);
  }

  Country.findAndCountAll(search).then(countries => {



    result.count = countries.count;
    result.data = countries.rows.slice((page - 1) * pageSize, page * pageSize);
    result.returnCode = 0;
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

router.get('/countries', (request, response) => {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  Country.findAll({
    where: {
      Id: request.query.countries.split(",")
    },
    order: [['Name', 'ASC']]

  }).then(data => {
    result.data = data;
    response.json(result);
  }).catch(err => {

  });
});
// Get country By Id
router.get('/:id', function (request, response) {

  var result = { returnCode: 0, data: null, returnMessage: "" };
  Country.findByPk(request.params.id).then(data => {
    if (data != null) {
      result.returnMessage = "success";
      result.returnCode = 1;
      result.data = data;
      response.json(result);
    }
    else {
      result.returnMessage = "user not find";
      response.json(result);
    }

  }).catch(err => {
    result.returnMessage = "server error";
    result.returnCode = -1;
    response.json(result);

  })

});


// Add country
router.post("/create", function (request, response) {

  var result = { returnCode: 0, data: null, returnMessage: "" };
  Country.create(request.body).then(country => {

    result.data = country;
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
  Country.findByPk(request.params.id).then(countries => {
    if (countries != null) {
      countries.Name = request.body.Name;
      countries.CountryCode = request.body.CountryCode;
      countries.save();
      result.data = countries;
      result.returnMessage = "Success"
    }
    else {
      result.returnCode = -1;
      result.returnMessage = "Country not found"
    }
    response.json(result);
  }).catch(err => {
    response.send(err);
  });
});

router.post("/delete/:id", function (request, response) {

  var result = { returnCode: 0, data: null, returnMessage: "" };
  Country.destroy({ where: { Id: request.params.id } }).then(country => {
    result.data = true;
    result.returnMessage = "Success";
    response.json(result);
  }).catch(err => {
    result.returnCode = -1;
    result.returnMessage = "Server Error";
    response.json(result);
  })
});


//All Countries by name
router.get("/name/all/:name", function (request, response) {

  var result = { returnCode: 0, data: null, returnMessage: "" };
  Country.findAll({ where: { Name: { [Op.like]: '' + request.params.name + '%' } } }).then(countries => {

    result.returnMessage = "Success";
    response.json(countries);
    return;
  }).catch(error => {
    result.returnCode = -1;
    result.returnMessage = "Server Error";
    response.json(result);
    return;
  });
});

router.post("/countryexist", function (request, response) {

  var result = { returnCode: 0, data: null, returnMessage: "" };
  Country.findOne({ where: { Name: request.body.Name, Id: { [Op.ne]: request.body.Id } } }).then(country => {
    if (country == null) {
      result.returnCode = 0;
      result.returnMessage = "country not exists";
    }
    else {
      result.returnCode = -1;
      result.returnMessage = "country already exist";
    }
    response.json(result);
  }).catch(err => {
    result.returnCode = -1;
    result.returnMessage = "Server Error";
    response.json(result);
  });
});

module.exports = router;
