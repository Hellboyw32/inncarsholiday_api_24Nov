var express = require("express");
const {
CarRegistration,
CarRentalPrice,
CarModel,
CarRentalOptionalCover,
Agency
} = require("../config/database");
var router = express.Router();
const Op = require("sequelize").Op; 

//All Countries
router.get("/", function (request, response) {
  
  var result = { returnCode: 0, data: null, returnMessage: "" };
  CarRentalPrice.findAll({where: { IsActive: true }}).then(res => {
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

//All  By paging
router.get("/paging/all", function (request, response) {
  var pageSize = request.query.page_size;
  var page = request.query.page;
  var result = { returnCode: 0, count: 0, data: null, returnMessage: "" };
  let whereParams = { IsActive: true };
  let orderParams = [["UpdatedOn", "DESC"]];
  if (request.query.search) {
    whereParams = {
      IsActive: true,
      [Op.or]: [
        {
          "$carregistration.PlateNo$": {
            [Op.like]: request.query.search + "%",
          },
        },
        { "$agency.name$": { [Op.like]: request.query.search + "%" } },
        { "$carmodel.name$": { [Op.like]: request.query.search + "%" } },
      ],
    };
  }
  if (request.query.sort_model) {
    orderParams = [
      [request.query.sort_model, request.query.sort_col, request.query.order],
    ];
  }
  CarRegistration.findAndCountAll({
    include: [
      {
        model: CarRentalPrice,
        as: "CarRentalPrices",
        where: { IsActive: true },
      },
      { model: CarModel, where: { IsActive: true } },
      { model: Agency, where: { IsActive: true } },
    ],
    order: orderParams,
    where: whereParams,
  })
    .then((res) => {
      result.count = res.rows.length;
      result.data = res.rows.slice((page - 1) * pageSize, page * pageSize);
      result.returnCode = 0;
      result.returnMessage = "Success";
      response.json(result);
    })
    .catch((error) => {
      console.log(error);
      result.returnCode = -1;
      result.returnMessage = "Server Error";
      response.json(result);
      return;
    });
});

//Get By Id
router.get('/:id',function(request,response){
    var result = { returnCode: 0, data: null, returnMessage: "" };
    CarRentalPrice.findByPk(request.params.id).then(res=>{
        if(res!=null)
        {
            result.data=res;
            result.returnCode=1;
            result.returnMessage="successfull"
            response.json(result);
        }
        else
        {
          result.returnMessage="User Not Found";
          response.json(result);
        }
    }).catch(err=>{
        response.send(err)
    })
})

//Get By CarRegistrationId
router.get('/carregistration/:Id', function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  CarRegistration.findByPk(request.params.Id, { include: [{ model: CarRentalPrice, as: 'CarRentalPrices', where: { IsActive: true } }] }).then(res => {
    if (res != null) {
      result.data = res;
      result.returnCode = 1;
      result.returnMessage = "successfull"
      response.json(result);
    }
    else {
      result.returnMessage = "User Not Found";
      response.json(result);
    }
  }).catch(err => {
    response.send(err)
  })
})

router.post("/create", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  CarRentalPrice.create(request.body).then(res => {
    result.data = res;
    result.returnMessage = "Success";
    response.json(result);
  }).catch(err => {
    result.returnCode = -1;
    result.returnMessage = "Server Error";
    response.json(result);
  })
});

router.post("/createbulk", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  CarRentalPrice.bulkCreate(request.body, { updateOnDuplicate: ["IsActive"] }).then(res => {
    result.returnCode = 1;
    result.data = res;
    result.returnMessage = "Success";
    response.json(result);
  }).catch(err => {
    console.log("bulk error", err);
    result.returnCode = -1;
    result.returnMessage = "Server Error";
    response.json(result);
  })
});




router.post("/update/:id", function (request, response) {
    
  var result = { returnCode: 0, data: null, returnMessage: "" };
  CarRentalPrice.findByPk(request.params.id).then(res => {
    if (res != null) {
        res.CarRegistrationId=request.body.CarRegistrationId;
        res.CarTypeId=request.body.CarTypeId;
        res.BeforeDiscountPrice=request.body.BeforeDiscountPrice;
        res. Price=request.body.Price;
        res.IsActive=true;
        res.CreatedOn=request.body.CreatedOn;
        res.UpdatedOn=request.body.UpdatedOn;
      res.save();
      result.data = res;
      result.returnMessage = "Success"
    }
    else {
      result.returnCode = -1;
      result.returnMessage = "RentalPrice  not found"
    }
    response.json(result);
  }).catch(err => {
    response.send(err);
  });
});




router.post("/delete/:id", function (request, response) {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: ""
  };
console.log(+request.params.id)
  CarRentalPrice.findByPk(+request.params.id).then(res => {
    if (res) {
      console.log(res);
      res.IsActive = false;
      res.save().then(() => {
        console.log("save");
        result.data = true;
        result.returnMessage = "Success";
        response.json(result);
      }).catch(err => {
        console.log(err);
        result.returnCode = -1;
        result.returnMessage = "Server Error";
        response.json(result);
      })
    }
  }).catch(err => {
    console.log(err);
    result.returnCode = -1;
    result.returnMessage = "Server Error";
    response.json(result);
  })
});
  
  module.exports = router;
