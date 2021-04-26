var express = require("express");
const {
  CoverageType, CoverageDetail,
} = require("../config/database");
var router = express.Router();
const Op = require("sequelize").Op;

//All Countries
router.get("/", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  CoverageType.findAll({order:[['Name', 'ASC']], where: { IsActive: true }}).then(countries => {
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

//Including details
router.get("/withdetails", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  CoverageType.findAll({order:[['Name', 'ASC']], where: { IsActive: true }, include: [{ model: CoverageDetail, where: { IsActive: true } }]}).then(countries => {
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

  search.where.IsActive = true;
  CoverageType.findAndCountAll(search).then(countries => {
    
   

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
  CoverageType.findAll({
    where: {
      Id: request.query.countries.split(",")
    },
    order:[['Name', 'ASC']]
    
  }).then(data => {
    result.data = data;
    response.json(result);
  }).catch(err => {
  
  });
});
// Get CoverageType By Id
router.get('/:id', function (request, response) {
  
    var result = { returnCode: 0, data: null, returnMessage: "" };
    CoverageType.findByPk(request.params.id).then(data=>{
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


// Add CoverageType
router.post("/create", function (request, response) {

  var result = { returnCode: 0, data: null, returnMessage: "" };
  request.body.IsActive = true;
  CoverageType.create(request.body).then(CoverageType => {
    result.data = CoverageType;
    result.returnMessage = "Success";
    response.json(result);
  }).catch(err => {
    console.log(err);
    result.returnCode = -1;
    result.returnMessage = "Server Error";
    response.json(result);
  })
});

router.put("/update/:id", function (request, response) {
  let result = {
    data: null,
    returnCode: 0,
    returnMessage: "Request not processed.",
  };
  CoverageType.update(
    {
      Name: request.body.Name,
      Price: request.body.Price,
      Link: request.body.Link,
      CoverageDescription: request.body.CoverageDescription,
      LinkDescription: request.body.LinkDescription,
      CoverageHeading: request.body.CoverageHeading,
      NameFrench: request.body.NameFrench,
      CoverageHeadingFrench: request.body.CoverageHeadingFrench,
      CoverageDescriptionFrench: request.body.CoverageDescriptionFrench,
      LinkFrench: request.body.LinkFrench,
      LinkDescriptionFrench: request.body.LinkDescriptionFrench
    },
    { where: { Id: request.params.id } }
  )
    .then((res) => {
      result.returnCode = 1;
      result.returnMessage = "CoverageType updated successfully!";
      result.data = res;
      response.json(result);
    })
    .catch((error) => {
      console.log(error);
      result.returnCode = -1;
      result.returnMessage = "CoverageType wasn't updated. Try again, please.";
      response.json(result);
    });
});

router.delete("/delete/:id", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  CoverageType.update( { IsActive: false }, { where: { Id: request.params.id } }).then(CoverageType => {
    result.data = true;
    result.returnMessage = "Success";
    result.returnCode = 1;
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
  CoverageType.findAll({ where: { Name: { [Op.like]: '' + request.params.name + '%' } } }).then(countries => {
    
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

router.post("/CoverageTypeexist", function (request, response) {
  
  var result = { returnCode: 0, data: null, returnMessage: "" };
  CoverageType.findOne({ where: { Name: request.body.Name, Id: { [Op.ne]: request.body.Id } } }).then(CoverageType => {
    if (CoverageType == null) {
      result.returnCode = 0;
      result.returnMessage = "CoverageType not exists";
    }
    else {
      result.returnCode = -1;
      result.returnMessage = "CoverageType already exist";
    }
    response.json(result);
  }).catch(err => {
    result.returnCode = -1;
    result.returnMessage = "Server Error";
    response.json(result);
  });
});

module.exports = router;
