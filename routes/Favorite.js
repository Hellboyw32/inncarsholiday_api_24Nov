var express = require("express");
const {
  Favorite,
  CarModel,
  CarRentalPrice,
  CarRegistration,
  OptionalCover,
  City,
  CarMake,
  CarType,
  CarOptionalCover,
  CarInclude,
  InculdeBenefit,
  CarAdditionalInclude,
  AdditionalBenefit,
  CarCity,
  User,
  UserProfile,
  Agency,
  CoverageDetail,
  CoverageType,
  CarPageLabel,
  CarRegistrationLabel,
} = require("../config/database");
const TransmissionTypes = require("../config/db/models/TransmissionTypes");
var router = express.Router();
const Op = require("sequelize").Op;

//All Countries
router.get("/", function (request, response) {
  
  var result = { returnCode: 0, data: null, returnMessage: "" };
  var query = '';
  if (!request.query.data) {
    Favorite.findAll(
      {
        where: { IpAddress: request.query.ip }
      }
    ).then(favorites => {
      result.data = favorites;
      result.returnMessage = "Success";
      response.json(result);
      return;
    }).catch(error => {
      result.returnCode = -1;
      result.returnMessage = "Server Error";
      response.json(result);
      return;
    });
  }
  else {
    Favorite.findAll(
      {
        where: { IpAddress: request.query.ip },
        include: {
          model: CarRegistration,
          include: [
            { model: CarType },
            {
              model: User,
              include:
                [
                  {
                    model: UserProfile
                  }
                ]
            },
            { model: CarModel, include: [{ model: CarMake }] },
            { model: CarRentalPrice },
            { model: CarOptionalCover, include: [{ model: OptionalCover }] },
            { model: CarInclude, include: [{ model: InculdeBenefit }] },
            { model: CarAdditionalInclude, include: [{ model: AdditionalBenefit }] },
            { model: CarCity, include: [{ model: City }] }
          ]
        }
      }
    ).then(favorites => {
      result.data = favorites;
      result.returnMessage = "Success";
      response.json(result);
      return;
    }).catch(error => {
      result.returnCode = -1;
      result.returnMessage = "Server Error";
      response.json(result);
      return;
    });
  }


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

  Favorite.findAndCountAll(search).then(favorites => {
    


    result.count = favorites.count;
    result.data = favorites.rows.slice((page - 1) * pageSize, page * pageSize);
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

router.get('/favorites', (request, response) => {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  Favorite.findAll({
    where: {
      Id: request.query.favorites.split(",")
    },
    order: [['Name', 'ASC']]

  }).then(data => {
    result.data = data;
    response.json(result);
  }).catch(err => {

  });
});
// Get Favorite By Id
router.get('/:id', function (request, response) {
  
  var result = { returnCode: 0, data: null, returnMessage: "" };
  Favorite.findByPk(request.params.id).then(data => {
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


// Add Favorite
router.post("/create", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  Favorite.findOne({ where: { IsActive: true, CarRegeistrationId: request.body.CarRegeistrationId, Email: request.body.Email } }).then(resFav => {
      if (resFav) {
        result.returnCode = 2;
        response.json(result);
      } else {
        Favorite.create(request.body)
          .then((Favorite) => {
            result.returnCode = 1;
            result.data = Favorite;
            result.returnMessage = "Success";
            response.json(result);
          })
          .catch((err) => {
            console.log(err);
            result.returnCode = -1;
            result.returnMessage = "Server Error";
            response.json(result);
          });
      }
    }
  ).catch(err => {
    console.log(err);
  })
});
var Sequelize = require("sequelize");

router.get("/getbyemail/:email", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  let coverageAttributes = ['Id','Name','Price','CoverageHeading','CoverageDescription','Link','LinkDescription'];
  let coverageDetailAttributes = ['Id', 'Name']
  if(request.params.lang && request.params.lang == "french"){
    coverageAttributes = ['Id',['NameFrench','Name'],'Price',['CoverageHeadingFrench', 'CoverageHeading'],['CoverageDescriptionFrench', 'CoverageDescription'],['LinkFrench', 'Link'],['LinkDescriptionFrench', 'LinkDescription']];
    coverageDetailAttributes = ['Id', ['NameFrench','Name']]
  }
  Favorite.findAll({
    where: { IsActive: true, Email: request.params.email },
    include: [
      {
        model: CarRegistration,
        where: { IsActive: true },
        include: [
          {
            model: Agency,
            attributes: {
              include: [
                [
                  Sequelize.literal(
                    "(SELECT ROUND(AVG(rr.Rating)) FROM ratereview rr where rr.VendorId = `CarRegistration.Agency.Id`)"
                  ),
                  "Rating",
                ],
              ],  
            },
          },
          { model: CoverageType, where: { IsActive: true}, attributes: coverageAttributes, include: [ { model: CoverageDetail, where: { IsActive: true }, attributes: coverageDetailAttributes }] },
          { model: CarRegistrationLabel, separate: true, include: [ { model: CarPageLabel, where: { IsActive: true } }] },
          { model: CarModel, where: { IsActive: true }, include: [{ model: CarMake, where: { IsActive: true } }, { model: TransmissionTypes, where: { IsActive: true } }] },
          { model: CarOptionalCover, separate: true, include: [{ model: OptionalCover, where: { IsActive: true } }] },
          { model: CarInclude, separate: true, include: [{ model: InculdeBenefit, where: { IsActive: true } }] },
          { model: CarAdditionalInclude, separate: true, include: [{ model: AdditionalBenefit,  where: { IsActive: true } }] },
          { model: CarType, where: { IsActive: true } }
        ],
      },
    ],
  })
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
      console.log(err);
      result.returnMessage = "server error";
      result.returnCode = -1;
      response.json(result);
    });
});

router.post("/update/:id", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  Favorite.findByPk(request.params.id).then(favorites => {
    if (favorites != null) {
      favorites.Name = request.body.Name;
      favorites.FavoriteCode = request.body.FavoriteCode;
      favorites.save();
      result.data = favorites;
      result.returnMessage = "Success"
    }
    else {
      result.returnCode = -1;
      result.returnMessage = "Favorite not found"
    }
    response.json(result);
  }).catch(err => {
    response.send(err);
  });
});

router.post("/delete/:id", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  Favorite.destroy({ where: { Id: request.params.id } }).then(Favorite => {
    result.data = true;
    result.returnCode = 1;
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
  Favorite.findAll({ where: { Name: { [Op.like]: '' + request.params.name + '%' } } }).then(favorites => {
    
    result.returnMessage = "Success";
    response.json(favorites);
    return;
  }).catch(error => {
    result.returnCode = -1;
    result.returnMessage = "Server Error";
    response.json(result);
    return;
  });
});

router.post("/Favoriteexist", function (request, response) {
  
  var result = { returnCode: 0, data: null, returnMessage: "" };
  Favorite.findOne({ where: { Name: request.body.Name, Id: { [Op.ne]: request.body.Id } } }).then(Favorite => {
    if (Favorite == null) {
      result.returnCode = 0;
      result.returnMessage = "Favorite not exists";
    }
    else {
      result.returnCode = -1;
      result.returnMessage = "Favorite already exist";
    }
    response.json(result);
  }).catch(err => {
    result.returnCode = -1;
    result.returnMessage = "Server Error";
    response.json(result);
  });
});

module.exports = router;
