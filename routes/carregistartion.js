var express = require("express");
const {
  CarModel,
  CarRegistration,
  Agency,
  User,
  UserProfile,
  CarType,
  CarRentalPrice,
  CarOptionalCover,
  OptionalCover,
  CarInclude,
  CarAdditionalInclude,
  InculdeBenefit,
  AdditionalBenefit,
  CarCity,
  City,
  CarRental,
  CarMake,
  TransmissionTypes,
  Deal,
  DealSummery,
  Country,
  Locality,
  RateReview,
  LocationTypeMeta,
  CoverageDetail,
  CoverageType,
  CarPageLabel,
  CarRegistrationLabel
} = require("../config/database");
var router = express.Router();
const Op = require("sequelize").Op;
var Sequelize = require("sequelize");
var CryptoJS = require("crypto-js");

//imported directly from global to use sequelize.query directly
const globalSequelize = require("../config/db/global/global-import");
const { QueryTypes } = require('sequelize');

//for email
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

// const oauth2Client = new OAuth2(

// );

// oauth2Client.setCredentials({
//   refresh_token: ""
// });

// const accessToken = oauth2Client.getAccessToken();


var smtpTransport = nodemailer.createTransport({
  host: "mail.inncarsholiday.com",  
  port: 25,
  secure: false,
  logger: true,
  requireTLS: true,
  debug: true,
  ignoreTLS: true, // add this 
  auth: {
    user: "booking@inncarsholiday.com",
    pass: "bookMe@123Inncars"
  }, tls: {
    rejectUnauthorized: false
}
})

router.post("/sendemail", function (request, response) {
  const mailOptions = {
    from: "booking@inncarsholiday.com",
    to: "ram.juttlegadoo@gmail.com",
    subject: "Test confirmation email.",
    generateTextFromHTML: true,
    html: "<b>This is a test email using Nodemailer that we are checking. If you receive this email then it's working fine.</b>",
  };
  smtpTransport.sendMail(mailOptions, (error, res) => {
    error ? console.log(error) : console.log(res);
    smtpTransport.close();
  });
  return;
});

router.post("/trysendemail", function (request, response) {
 // console.log("Access Token",accessToken);
  const mailOptions = {
    from: "booking@inncarsholiday.com",
    to: "ram.juttlegadoo@gmail.com",
    subject: "Node.js Email with Secure OAuth",
    generateTextFromHTML: true,
    html: "<b>test</b>",
  };
  smtpTransport.sendMail(mailOptions, (error, res) => {
    error ? console.log(error) : console.log(res);
    smtpTransport.close();
  });
  return;
});

router.get("/", function (request, response) {
  
  var result = { returnCode: 0, data: null, returnMessage: "" };
  CarRegistration.findAll({
    include: [{ model: CarModel }, { model: CarRentalPrice }]
  })
    .then(res => {
      result.data = res;
      result.returnMessage = "Success";
      response.json(result);
      return;
    })
    .catch(error => {
      result.returnCode = -1;
      result.returnMessage = "Server Error";
      response.json(result);
      return;
    });
});

router.get("/carforpricing", function(request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  tempSQL = 'SELECT CarRegistrationId FROM CarRentalPrice WHERE IsActive = true';
  CarRegistration.findAll({
    where: {
      Id: {
        [Sequelize.Op.notIn]: Sequelize.literal(`(${tempSQL})`)  
      },
      IsActive: true
    },
    include: [{ model: CarModel, where: { IsActive: true } }]
  })
    .then(res => {
      result.data = res;
      result.returnMessage = "Success";
      response.json(result);
      return;
    })
    .catch(error => {
      result.returnCode = -1;
      result.returnMessage = error;
      response.json(result);
      return;
    });
})

router.get("/carforpricingupdate", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  CarRegistration.findAll({
    include: [
      { model: CarModel, where: { IsActive: true } },
      { model: CarRentalPrice, as: 'CarRentalPrices', where: { IsActive: true } },
    ],
    where: { IsActive: true },
  })
    .then((res) => {
      result.data = res;
      result.returnMessage = "Success";
      response.json(result);
      return;
    })
    .catch((error) => {
      result.returnCode = -1;
      result.returnMessage = error;
      response.json(result);
      return;
    });
});
// if (search && search != "" && search != "empty") {
//   requestParams.where = {
//     [Op.or]: [
//       { Email: { [Op.like]: search + "%" } },
//       { Name: { [Op.like]: search + "%" } },
//     ],
//   };
// }
//All  By paging
router.get("/paging/all", function (request, response) {
  var pageSize = request.query.page_size;
  var page = request.query.page;
  var result = { returnCode: 0, count: 0, data: null, returnMessage: "" };
  let whereParams = { IsActive: true };
  let orderParams = [["CreatedOn", "DESC"]];
  if (request.query.search) {
    whereParams = {
      IsActive: true,
      [Op.or]: [
        { PlateNo: { [Op.like]: request.query.search + "%" } },
        { "$cartype.name$": { [Op.like]: request.query.search + "%" } },
        { "$agency.name$": { [Op.like]: request.query.search + "%" } },
        { "$carmodel.name$": { [Op.like]: request.query.search + "%" } },
      ],
    };
  }
  if (request.query.sort_model) {
    orderParams = [ [ request.query.sort_model, request.query.sort_col, request.query.order ],];
  }
  CarRegistration.findAndCountAll({
    include: [
      { model: CarModel, required: true, where: { IsActive: true } },
      { model: Agency, required: true, where: { IsActive: true } },
      { model: CarType, required: true, where: { IsActive: true } },
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


router.get("/car/getDetail", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  CarRegistration.findByPk(request.query.id, {
    include: [
      {
        model: Agency,
        attributes: {
          include: [
            [
              Sequelize.literal(
                `(SELECT ROUND(AVG(rr.Rating)) FROM ratereview rr where rr.VendorId = Agency.Id)`
              ),
              "Rating",
            ],
          ],
        },
      },
      { model: CoverageType, where: { IsActive: true}, include: [ { model: CoverageDetail, where: { IsActive: true } }] },
      { model: CarRegistrationLabel, include: [ { model: CarPageLabel, where: { IsActive: true } }] },
      { model: CarType, where: { IsActive: true } },
      { model: CarModel, include: [{ model: CarMake, where: { IsActive: true } }, { model: TransmissionTypes, where: { IsActive: true } }] },
      { model: CarRentalPrice, where: { IsActive: true } },
      { model: CarOptionalCover, include: [{ model: OptionalCover, where: { IsActive: true } }] },
      { model: CarInclude, include: [{ model: InculdeBenefit, where: { IsActive: true } }] },
      { model: CarAdditionalInclude, include: [{ model: AdditionalBenefit, where: { IsActive: true } }] },
      // { model: CarCity, include: [{ model: City, where: { IsActive: true } }] },
      // { model: DealSummery, include: [{ model: Deal, where: { IsActive: true } }] },
    ],
  })
    .then((res) => {
      if (res != null) {
        result.data = res;
        result.returnCode = 1;
        result.returnMessage = "successfull";
        response.json(result);
      } else {
        result.returnMessage = "User Not Found";
        response.json(result);
      }
    })
    .catch((err) => {
      console.log(err);
      response.send(err);
    });
});

router.get("/car/getdetailwithpricing/:regid/:priceid/:lang?", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  let labelAttributes = ['Text', 'ColorCode', 'TypeId'];
  let coverageAttributes = ['Id','Name','Price','CoverageHeading','CoverageDescription','Link','LinkDescription'];
  let coverageDetailAttributes = ['Id', 'Name'];
  let additionalBenefitAttributes = ['Id', 'Description'];
  let includedBenefitAttributes = ['Id', 'Description'];
  if(request.params.lang && request.params.lang == "french"){
    coverageAttributes = ['Id',['NameFrench','Name'],'Price',['CoverageHeadingFrench', 'CoverageHeading'],['CoverageDescriptionFrench', 'CoverageDescription'],['LinkFrench', 'Link'],['LinkDescriptionFrench', 'LinkDescription']];
    coverageDetailAttributes = ['Id', ['NameFrench','Name']]
    additionalBenefitAttributes = ['Id', ['DescriptionFrench', 'Description']];
    includedBenefitAttributes = ['Id', ['DescriptionFrench', 'Description']];
    labelAttributes = [['TextFrench', 'Text'], 'ColorCode', 'TypeId'];
  }
  CarRegistration.findByPk(+request.params.regid, {
    include: [
      {
        model: Agency,
        attributes: {
          include: [
            [
              Sequelize.literal(
                `(SELECT ROUND(AVG(rr.Rating)) FROM ratereview rr where rr.VendorId = Agency.Id)`
              ),
              "Rating",
            ],
          ],  
        },
      },
      { model: CoverageType, where: { IsActive: true}, attributes: coverageAttributes, include: [ { model: CoverageDetail, where: { IsActive: true }, attributes: coverageDetailAttributes }] },
      { model: CarRegistrationLabel, separate: true, include: [ { model: CarPageLabel, where: { IsActive: true }, attributes: labelAttributes }] },
      // { model: CarType, where: { IsActive: true } },
      { model: CarModel, include: [{ model: CarMake, where: { IsActive: true } }, { model: TransmissionTypes, where: { IsActive: true } }] },
      { model: CarRentalPrice, as: 'CarRentalPrice', where: { IsActive: true, Id: +request.params.priceid } },
      { model: CarOptionalCover, separate: true, include: [{ model: OptionalCover, where: { IsActive: true } }] },
      { model: CarInclude, separate: true, include: [{ model: InculdeBenefit, where: { IsActive: true }, attributes: includedBenefitAttributes  }] },
      { model: CarAdditionalInclude, separate: true, include: [{ model: AdditionalBenefit,  where: { IsActive: true }, attributes: additionalBenefitAttributes }] },
      // { model: CarCity, include: [{ model: City, where: { IsActive: true } }] },
      // { model: DealSummery, include: [{ model: Deal, where: { IsActive: true } }] },
    ],
  })
    .then((res) => {
      if (res != null) {
        result.data = res;
        result.returnCode = 1;
        result.returnMessage = "successfull";
        response.json(result);
      } else {
        result.returnMessage = "User Not Found";
        response.json(result);
      }
    })
    .catch((err) => {
      console.log(err);
      response.send(err);
    });
});


//Get By Id
router.get("/:id", function (request, response) {

  var result = { returnCode: 0, data: null, returnMessage: "" };
  CarRegistration.findByPk(request.params.id, {
    include: [
      { model: CarOptionalCover, include: [{ model: OptionalCover, where: { IsActive: true } }] },
      { model: CarInclude, separate: true, include: [{ model: InculdeBenefit, where: { IsActive: true } }] },
      { model: CarAdditionalInclude, separate: true, include: [{ model: AdditionalBenefit, where: { IsActive: true } }] },
      { model: CarCity, separate: true, include: [{ model: City, where: { IsActive: true } }] },
      { model: CarModel, include: [{ model: CarMake, where: { IsActive: true } }] },
      // { model: CarRentalPrice, where: { IsActive: true } },
      {
        model: Agency,
        where: { IsActive: true }
      },
      { model: CarRegistrationLabel, include: [{ model: CarPageLabel, where: { IsActive: true } }] },
    ]
  })
    .then(res => {
      if (res != null) {
        result.data = res;
        result.returnCode = 1;
        result.returnMessage = "successfull";
        response.json(result);
      } else {
        result.returnMessage = "User Not Found";
        response.json(result);
      }
    })
    .catch(err => {
      console.log(err);
      response.send(err);
    });
});

// router.get("/car/getDetail", function (request, response) {
//   
//   var result = {
//     returnCode: 0,
//     data: null,
//     returnMessage: ""
//   };

//   var filterQuery = "Select * from CarRegistration as reg left join CarModel as model"
//     + " on reg.CarModelId=model.Id left join CarType as cartype"
//     + " on reg.CarTypeId=cartype.Id left join CarMake as carcompany "
//     + " on model.CarMakeId=carcompany.Id left join CarInclude as carinclude"
//     + " on reg.id=carinclude.CarRegistrationId left join IncludeBenefit as include"
//     + " on carinclude.IncludeId=include.Id left join CarAdditionalInclude as caradditional"
//     + " on reg.Id=caradditional.CarRegistrationId left join AdditionalBenefit as additional"
//     + " on additional.Id=caradditional.AdditionalIncludeId left join CarRentalPrice as rentalprice"
//     + " on reg.Id=rentalprice.CarRegistrationId"
//     + " where reg.Id=" + (+request.query.id)

//   CarRegistration.sequelize
//     .query(filterQuery, { type: Sequelize.QueryTypes.SELECT }
//     )
//     .then(res => {
//       
//       if (res.length > 0) {
//         result.returnCode = 1;
//         result.returnMessage = "success";
//         result.data = res;
//       }
//       else {
//         result.returnMessage = "somthing wrong";
//       }
//       response.json(result);
//     })
//     .catch(err => {
//       response.send(err);
//     });
// });







//Get All Cities By Vendor
router.get("/car/getAllCites", function (request, response) {
  
  var result = { returnCode: 0, data: null, returnMessage: "" };

  var query = "SELECT distinct(city.Id),city.Name FROM CarCity as cc left join CarRegistration as cr on "
    + "cc.CarRegistrationId=cr.Id left join City as city on"
    + " cc.CityId=city.Id where VenderId=" + request.query.id;


  CarRental.sequelize
    .query(
      query,
      { type: Sequelize.QueryTypes.SELECT }
    )
    .then(res => {
      
      if (res != null) {
        result.data = res;
        result.returnCode = 1;
        result.returnMessage = "successfull";
        response.json(result);
      }
    })
    .catch(err => {
      response.send(err);
    });
});


//Get All Cities By Vendor
router.post("/car/forDeals", function (request, response) {
  
  var result = { returnCode: 0, data: null, returnMessage: "" };

  var query = "SELECT distinct(cr.Id),PlateNo FROM CarRegistration as cr left join CarCity as cc"
    + " on cr.Id=cc.CarRegistrationId where cr.VenderId=" + request.body.vendorId + " and cc.CityId in (" + request.body.cities + ")";


  CarRegistration.sequelize
    .query(
      query,
      { type: Sequelize.QueryTypes.SELECT }
    )
    .then(res => {
      
      if (res != null) {
        result.data = res;
        result.returnCode = 1;
        result.returnMessage = "successfull";
        response.json(result);
      }
    })
    .catch(err => {
      response.send(err);
    });
});




router.post("/create", function (request, response) {
  
  var result = { returnCode: 0, data: null, returnMessage: "" };
  CarRegistration.create(request.body)
    .then(res => {
      savecoveroptionaldata(res.Id, request.body.CarOptionalCover);
      saveinclude(res.Id, request.body.CarIncludes);
      saveAdditionalInclude(res.Id, request.body.CarAdditionalInclude);
      savecarcity(res.Id, request.body.CarCity);

      result.data = res;
      result.returnMessage = "Success";
      response.json(result);
    })
    .catch(err => {
      console.log(err);
      result.returnCode = -1;
      result.returnMessage = "Server Error";
      response.json(result);
    });
});

function savecoveroptionaldata(Id, model) {
  
  model.OptionalCoverId.forEach(element => {
    var obj = {};
    (obj.CarRegistrationId = Id),
      (obj.OptionalCoverId = element.item_id),
      (obj.IsActive = true),
      (obj.CreatedOn = new Date());

    CarOptionalCover.create(obj).then(res => {
      
      if (res != null) {
        return true;
      }
    });
  });
}

function saveinclude(Id, model) {
  
  model.CarInclude.forEach(element => {
    var obj = {};
    (obj.CarRegistrationId = Id),
      (obj.IncludeId = element.item_id),
      (obj.IsActive = true),
      (obj.CreatedOn = new Date());

    CarInclude.create(obj).then(res => {
      
      if (res != null) {
        return true;
      }
    });
  });
}

function saveAdditionalInclude(Id, model) {
  

  model.Additionalinclude.forEach(element => {
    var obj = {};
    (obj.CarRegistrationId = Id),
      (obj.AdditionalIncludeId = element.item_id),
      (obj.IsActive = true),
      (obj.CreatedOn = new Date());

    CarAdditionalInclude.create(obj).then(res => {
      
      if (res != null) {
        return true;
      }
    });
  });
}

function savecarcity(Id, model) {
  

  model.RegisterCity.forEach(element => {
    var obj = {};
    obj.CarRegistrationId = Id;
    (obj.CityId = element.item_id),
      (obj.IsActive = true),
      (obj.CreatedOn = new Date());

    CarCity.create(obj).then(res => {
      if (res != null) {
        return true;
      }
    });
  });
}

function saveCarPageLabel(Id, model) {
  model.RegistrationLabel.forEach((element) => {
    var obj = {};
    obj.CarRegistrationId = Id;
    (obj.CarPageLabelId = element.item_id),
      (obj.IsActive = true),
      (obj.CreatedOn = new Date());

    CarRegistrationLabel.create(obj).then((res) => {
      if (res != null) {
        return true;
      }
    });
  });
}

router.post("/update/:id", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  CarRegistration.findByPk(request.params.id)
    .then((res) => {
      if (res != null) {
        res.WhyRecommendedText = request.body.WhyRecommendedText;
        res.Name = request.body.Name;
        res.CarTypeId = request.body.CarTypeId;
        res.VenderId = request.body.VenderId;
        res.CarModelId = request.body.CarModelId;
        res.PlateNo = request.body.PlateNo;
        res.IsFeatured = request.body.IsFeatured;
        res.IsInStock = request.body.IsInStock;
        res.IsBestSeller = request.body.IsBestSeller;
        res.IsExcellentDeal = request.body.IsExcellentDeal;
        res.IsRecommended = request.body.IsRecommended;
        res.FuelTypeId = request.body.FuelTypeId;
        res.ImageType = request.body.ImageType;
        res.LargeImageType = request.body.LargeImageType;
        res.SmallImageType = request.body.SmallImageType;
        res.ComissionPercentage = request.body.ComissionPercentage;
        res.InsuranceTypeId = request.body.InsuranceTypeId;
        res.IsActive = true;
        res.CreatedOn = request.body.CreatedOn;
        res.UpdatedOn = request.body.UpdatedOn;
        UpdateoptionalCoverData(res.Id, request.body.CarOptionalCover);
        UpdateInclude(res.Id, request.body.CarIncludes);
        AdditionalInclude(res.Id, request.body.CarAdditionalInclude);
        updatecarcity(res.Id, request.body.CarCity);
        updateCarPageLabels(res.Id, request.body.CarRegistrationLabel);
        res.save()
          .then(() => {
            result.returnCode = 1;
            result.data = true;
            result.returnMessage = "Car Registeration has been updated!";
          })
          .catch(() => {
            result.returnCode = -1;
            result.data = false;
            result.returnMessage = "Something went wrong!";
          })
          .finally(() => {
            response.json(result);
          });
      } else {
        result.returnCode = -1;
        result.returnMessage = "CarRegistration  not found";
        response.json(result);
      }
    })
    .catch((err) => {
      response.send(err);
    });
});

function UpdateoptionalCoverData(Id, model) {
  
  CarOptionalCover.destroy({ where: { CarRegistrationId: Id } }).then(res => {
    
    var res = savecoveroptionaldata(Id, model);
    return true;
  });
}

function UpdateInclude(Id, model) {
  
  CarInclude.destroy({ where: { CarRegistrationId: Id } }).then(res => {
    
    saveinclude(Id, model);
    return true;
  });
}

function AdditionalInclude(Id, model) {
  
  CarAdditionalInclude.destroy({ where: { CarRegistrationId: Id } }).then(
    res => {
      
      saveAdditionalInclude(Id, model);
    }
  );
}

function updatecarcity(Id, model) {
  CarCity.destroy({ where: { CarRegistrationId: Id } }).then(res => {
    
    savecarcity(Id, model);
  });
}

function updateCarPageLabels(Id, model){
  CarRegistrationLabel.destroy({ where: { CarRegistrationId: Id }}).then(res => {
    saveCarPageLabel(Id, model);
  });
}

router.post("/delete/:id", function (request, response) {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: ""
  };
  CarRegistration.findByPk(request.params.id)
    .then(res => {
      if (res != null) {
        res.IsActive = false;
        res.save();
        result.data = true;
        result.returnMessage = "Success";
        response.json(result);
      }
    })
    .catch(err => {
      result.returnCode = -1;
      result.returnMessage = "Server Error";
      response.json(result);
    });
});


//all get all car types
router.get('/CarTypes/all', function (request, response) {
  
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: ""
  };
  CarType.findAll({
    where: { IsActive: true }, include: [{ model: TransmissionTypes },
    {
      model: CarRegistration
    }]
  }).then(types => {
    result.data = types;
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

router.get('/checkexistingplate/:plateno', function(request, response){
  let result = {
    returnCode: 1,
    data: null,
    returnMessage: "Success"
  }
  CarRegistration.findAll({where: { PlateNo: request.params.plateno }}).then(res => {
    if(res){
      result.data = res;
    }
    response.json(result);
  }).catch(error => {
    result.returnCode = -1;
    result.returnMessage = error;
    response.json(result);
  })
})


function findCommonElements(arr1, arr2) {
  var common = [];
  for (var i = 0; i < arr1.length; i++) {
    for (var j = 0; j < arr2.length; j++) {
      if (arr1[i].getTime() == arr2[j].getTime()) {
        common.push(arr1[i]);
      }
    }
  }
  return common;
}
function getDateArray(start, end) {
  var arr = new Array();
  var dt = new Date(start);
  var dt1 = new Date(end);
  while (dt <= dt1) {
    arr.push(new Date(dt));
    dt.setDate(dt.getDate() + 1);
  }
  return arr;
}

router.get("/getcommission/:carregid", (request, response) => {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  CarRegistration.findByPk(+request.params.carregid, {
    attributes: ["ComissionPercentage"],
  })
    .then((res) => {
      if (res) {
        result.data = res;
        result.returnMessage = "Commission Percentage found";
        result.returnCode = 1;
      } else result.returnCode = -1;
    })
    .catch((error) => {
      console.log(error);
      result.returnMessage = error;
      result.returnCode = -1;
    })
    .finally(() => response.json(result));
});

function calculateDays(StartDate, EndDate) {
  const oneDay = 24 * 60 * 60 * 1000;
  const firstDate = new Date(StartDate);
  const lastDate = new Date(EndDate);
  firstDate.setHours(0, 0, 0);
  lastDate.setHours(0, 0, 0);
  return Math.round(Math.abs((firstDate - lastDate) / oneDay));
}

//Default Filter
router.get("/improvisedefault/list/", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  if (
    new Date(request.query.startdate) > new Date(request.query.enddate) ||
    new Date(request.query.enddate) == new Date(request.query.startdate)
  ) {
    response.status(500).send({
      message: "Server side error",
    });
  }
  var totalDays = calculateDays(request.query.startdate, request.query.enddate);
  var filterQuery = "";
  filterQuery +=
  "SELECT CReg.Id as 'Id', CReg.VenderId as 'AgencyId', CReg.IsInStock as 'IsInStock', CReg.ComissionPercentage as 'Comission', CReg.PlateNo as 'PlateNo',  CReg.ImageType as 'ImageType', CReg.LargeImageType as 'LargeImageType',"
  +" CReg.SmallImageType as 'SmallImageType', CReg.CarTypeId as 'CarType', CReg.WhyRecommendedText as 'WhyRecommendedText', CReg.IsBestSeller as 'IsBestSeller', CReg.IsExcellentDeal as 'IsExcellentDeal', CReg.IsRecommended as 'IsRecommended',"
  +" CReg.FuelTypeId as 'FuelType', Cmod.Name as 'Model.Name', CMod.Capacity as 'Model.Capacity', CMod.Doors as 'Model.Doors', CMod.TransmissionTypeId as 'Model.TransmissionTypeId',"
  +" CMod.BigPieceLuggage as 'Model.BigPieceLuggage', CMod.SmallPieceLuggage as 'Model.SmallPieceLuggage',"
  +" CPrice.Price as 'Price', CPrice.BeforeDiscountPrice as 'Discount', CPrice.Id as CPID, tt.Name as 'TransmissionTypeName', "
  +" CM.Name as 'CarMake', CM.Id as 'CarMakeId',"
  +" DL.Cities as 'DealCities', DL.DiscountPercentage as 'DiscountPercentage',"
  +" AG.Name as 'Agency.Name', AG.LogoPath as 'Agency.Logo', AG.Description as 'Agency.Description', AG.Abbreviation as 'Agency.Abbreviation',"
  +" CovT.Name as 'Insurance.Name', "
  +" CovT.Price as 'Insurance.Price',"
  +" (SELECT Round(AVG(Rating), 0) FROM ratereview as rr WHERE rr.VendorId = AG.Id) AS 'Agency.AvgScore' "
  +" FROM Phcarrental.CarRegistration AS CReg "
  +" INNER JOIN CarModel as CMod ON CReg.CarModelId = CMod.Id AND CMod.IsActive = true "
  +" Inner Join CoverageType as CovT On CReg.InsuranceTypeId = CovT.Id AND CovT.IsActive = true" 
  +" Inner Join Agency as AG On CReg.VenderId = AG.Id AND AG.IsActive = true "
  +" left Join (Phcarrental.DealSummery as DS Inner Join Deal as DL on DL.Id = DS.DealId AND DATE(DL.From) <= '"+
  request.query.startdate + "' AND DATE(DL.To) >= '"+request.query.enddate+"' And DL.IsActive = true) On CReg.Id "
  +" = DS.CarRegistrationId "
  +" Inner Join (SELECT carprice.CarRegistrationId, carprice.Id, carprice.Price, carprice.BeforeDiscountPrice, carprice.IsActive FROM carrentalprice as carprice INNER JOIN (SELECT max(FromDay) as FromDay, max(carrentalprice.From) as FromDate, CarRegistrationId, IsActive FROM carrentalprice WHERE IsActive = true GROUP BY CarRegistrationId) AS cp ON cp.CarRegistrationId = carprice.CarRegistrationId AND carprice.CarRegistrationId "
  +" In (SELECT CarRegistrationId FROM carrentalprice WHERE IsActive = true  AND carprice.IsActive = cp.IsActive )) AS CPrice On CReg.Id = CPrice.CarRegistrationId AND CPrice.IsActive = true"
   +" Inner Join CarType as CT On CReg.CarTypeId = CT.Id AND CT.IsActive = true"
   +" Inner Join transmissiontypes as tt On CMod.TransmissionTypeId = tt.Id"
   +" Inner Join CarMake as CM On CMod.CarMakeId = CM.Id AND CM.IsActive = true"
   +" WHERE CReg.Id IN (SELECT "
  +" CarRegistrationId FROM CarCity WHERE CityId = "+request.query.cityid+") AND CReg.IsActive = true AND CReg.IsInStock = true";
//console.log("query===========",filterQuery);
  CarRental.sequelize
    .query(filterQuery, {
      nest: true,
      type: Sequelize.QueryTypes.SELECT,
    })
    .then((resp) => {
      result.data = resp;
      result.returnMessage = "Success";
      response.json(result);
    })
    .catch((error) => {
      console.log(error);
      result.returnCode = -1;
      result.returnMessage = "Server Error";
      response.json(result);
    });
});

//Home Page Fillter

router.get("/byLocation/home", function (request, response) {
  
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: ""
  };
  var filterData = [];
  var filterQuery = "";
  filterQuery +=
    "SELECT *,cr.VenderId as VendorId,typess.Name as TransmissionTypeName, cr.Id as Id ,cmod.Name as CarName,company.Name as Company, " +
    "cr.Id as CarRegId FROM  CarCity as cc left JOIN  CarRegistration as cr ON  cr.Id = cc.CarRegistrationId " +
    "  inner JOIN CarRentalPrice as cp ON cp.CarRegistrationId = cr.Id " +
    " left JOIN CarModel as cmod  ON cmod.Id = cr.CarModelId " +
    " left JOIN CarMake as company  ON company.Id = cmod.CarMakeId " +
    " left JOIN User as usr  ON" +
    " cr.VenderId = usr.Id left JOIN UserProfile as usrprofile  ON" +
    " usrprofile.UserId=usr.Id" +
    " left join TransmissionTypes as typess on cmod.TransmissionTypeId=typess.Id" +
    " left join DealSummery as DealSummery on DealSummery.CarRegistrationId=cr.Id" +
    " left join Deal as Deal on Deal.Id=DealSummery.DealId" +
    " AND DATE(Deal.From) <=" +
    "'" +
    request.query.bookingfrom +
    "'" +
    " AND DATE(Deal.To) >=" +
    "'" +
    request.query.bookingto +
    "'" +
    "  where cc.CityId=" +
    +request.query.CityId;
  CarRental.sequelize
    .query(
      // " SELECT * FROM CarRental as cr where cr.PickUpLocationId = " +
      // request.query.LocationId + ' and BookedStatusId=1',
            " SELECT * FROM CarRental as cr where cr.PickUpLocationId = " +
      request.query.LocationId,
      { type: Sequelize.QueryTypes.SELECT }
    )
    .then(res => {
      if (res.length > 0) {
        CarCity.sequelize
          .query(filterQuery,
            { type: Sequelize.QueryTypes.SELECT }
          )
          .then(qry => {
            if (qry != null) {
              qry.forEach(element => {
                
                if (res.filter(x => x.CarRegistrationId == element.CarRegId)[0]) {
                  var booked = res.filter(x => x.CarRegistrationId == element.CarRegId)[0];
                  var bookedDates = getDateArray(
                    booked.BookingFrom.split("T")[0],
                    booked.BookingTo.split("T")[0]
                  );
                  var requestedDates = getDateArray(
                    request.query.bookingfrom,
                    request.query.bookingto
                  );
                  var commonDates = findCommonElements(
                    requestedDates,
                    bookedDates
                  );
                  if (commonDates.length == 0) {
                    filterData.push(element);
                  }
                } else {
                  filterData.push(element);
                }
              });
              result.data = filterData;
              result.returnCode = 1;
              result.returnMessage = "success";
              response.json(result);
            }
          })
          .catch(err => {
            response.send(err);
          });
      } else {
        CarCity.sequelize
          .query(filterQuery,
            { type: Sequelize.QueryTypes.SELECT }
          )
          .then(res => {
            if (res != null) {
              result.data = res;
              result.returnCode = 1;
              result.returnMessage = "successfull";
              response.json(result);
            }
          })
          .catch(err => {
            response.send(err);
          });
      }
    })
    .catch(err => {
      response.send(err);
    });
});

// home page price filter
router.post("/byPrice/home", function (request, response) {
  
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: ""
  };
  var filterData = [];

  var filterQuery = "";
  filterQuery += "SELECT *, cr.VenderId as VendorId,typess.Name as TransmissionTypeName,cmod.Name as CarName,company.Name as Company, cr.Id as CarRegId FROM  CarCity as cc left JOIN  CarRegistration as cr ON  cr.Id = cc.CarRegistrationId "
    + " left JOIN   CarRentalPrice as cp ON cp.CarRegistrationId = cr.Id "
    + " left JOIN CarModel as cmod  ON cmod.Id = cr.CarModelId "
    + " left JOIN CarMake as company  ON company.Id = cmod.CarMakeId "
    + " left join TransmissionTypes as typess on cmod.TransmissionTypeId=typess.Id"
    + " left JOIN User as usr  ON"
    + " cr.VenderId = usr.Id left JOIN UserProfile as usrprofile  ON"
    + " usrprofile.UserId=usr.Id"
    + " left join DealSummery as DealSummery on DealSummery.CarRegistrationId=cr.Id"
    + " left join Deal as Deal on Deal.Id=DealSummery.DealId"
    + " AND DATE(Deal.From) <=" + "'" + request.query.bookingfrom + "'"
    + " AND DATE(Deal.To) >=" + "'" + request.query.bookingto + "'"
    + "  where cc.CityId=" + (+request.body.CityId);

  if (request && request.body && request.body.minValue >= 0 && request.body.maxValue >= 0) {
    filterQuery += " and cp.Price Between " + (+request.body.minValue) + " and " + (+request.body.maxValue) + "";
  }

  if (request && request.body && request.body.minCarSeats && request.body.maxCarSeats) {
    filterQuery += " and cmod.Capacity Between " + (+request.body.minCarSeats) + " and " + (+request.body.maxCarSeats) + "";
  }

  if (request && request.body && request.body.minCarBags && request.body.maxCarBags) {
    filterQuery += " and cmod.SmallPieceLuggage Between " + (+request.body.minCarBags) + " and " + (+request.body.maxCarBags) + "";
  }

  if (request && request.body && request.body.CarType) {
    filterQuery += " and cr.CarTypeId=" + (+request.body.CarType);
  }
  if (request && request.body && request.body.SelectedCompany) {
    filterQuery += " and company.Id in(" + (request.body.SelectedCompany) + ")";
  }
  if(request && request.body && request.body.SelectedCarType){
    filterQuery += " and cr.CarTypeId in(" + (request.body.SelectedCarType) + ")";
  }
  if(request && request.body && request.body.SelectedTransmissionType){
    filterQuery += " and cmod.TransmissionTypeId in(" + (request.body.SelectedTransmissionType) + ")";
  }
  if(request && request.body && request.body.SelectedFuelType){
    filterQuery += " and cr.FuelTypeId in (" + (request.body.SelectedFuelType) + ")";
  }
  CarRental.sequelize
    .query(
      " SELECT * FROM CarRental as cr where cr.PickUpLocationId = " +
      request.body.LocationId,
      { type: Sequelize.QueryTypes.SELECT }
    )
    .then(res => {
      console.log("DATA", res)
      if (res.length > 0) {
        CarCity.sequelize
          .query(filterQuery,
            { type: Sequelize.QueryTypes.SELECT }
          )
          .then(qry => {
            console.log("Qry", qry);
            if (qry != null) {
              qry.forEach(element => {
                if (
                  res.filter(
                    x => x.CarRegistrationId == element.CarRegId
                  )[0]
                ) {
                  
                  var booked = res.filter(
                    x => x.CarRegistrationId == element.CarRegId
                  )[0];
                  var bookedDates = getDateArray(
                    booked.BookingFrom.split("T")[0],
                    booked.BookingTo.split("T")[0]
                  );
                  var requestedDates = getDateArray(
                    request.body.StartDate,
                    request.body.EndDate
                  );
                  
                  var commonDates = findCommonElements(
                    requestedDates,
                    bookedDates
                  );
                  if (commonDates.length == 0) {
                    filterData.push(element);
                  }

                } else {
                  filterData.push(element);
                }
              });

              
              result.data = filterData;
              result.returnCode = 1;
              result.returnMessage = "success";
              response.json(result);
            }
          })
          .catch(err => {
            response.send(err);
          });
      } else {
        CarCity.sequelize
          .query(filterQuery,
            { type: Sequelize.QueryTypes.SELECT }
          )
          .then(res => {
            if (res != null) {
              result.data = res;
              result.returnCode = 1;
              result.returnMessage = "successfull";
              response.json(result);
            }
          })
          .catch(err => {
            response.send(err);
          });
      }
    })
    .catch(err => {
      response.send(err);
    });
});

router.get("/getAdditional/Inculdes/:lang?", function (request, response) {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: "",
  };
  let tempSQL =
    " SELECT * FROM CarAdditionalInclude as carinc inner join " +
    " IncludeBenefit as inc on inc.Id=carinc.AdditionalIncludeId where inc.IsActive = true AND carinc.CarRegistrationId in ( " +
    request.query.regIds +
    " ) ";
  if (request.params.lang && request.params.lang == "french")
    tempSQL =
      " SELECT carinc.*, inc.Id as Id, inc.DescriptionFrench as Description FROM CarAdditionalInclude as carinc inner join " +
      " IncludeBenefit as inc on inc.Id=carinc.AdditionalIncludeId where inc.IsActive = true AND carinc.CarRegistrationId in ( " +
      request.query.regIds +
      " ) ";
  AdditionalBenefit.sequelize
    .query(tempSQL, { type: Sequelize.QueryTypes.SELECT })
    .then((res) => {
      if (res.length > 0) {
        result.returnCode = 1;
        result.returnMessage = "success";
        result.data = res;
      } else {
        result.returnMessage = "somthing wrong";
      }
      response.json(result);
    })
    .catch((err) => {
      response.send(err);
    });
});

router.get("/carregistrationlabels/byidarray/:lang?", function (request, response) {
  let regIds = request.query.regIds.split(',');
  let labelAttributes = ['Text', 'ColorCode', 'TypeId'];
  if (request.params.lang && request.params.lang == "french")
  labelAttributes = [['TextFrench', 'Text'], 'ColorCode', 'TypeId'];
  for (var i = 0; i < regIds.length; i++) regIds[i] = +regIds[i];
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: ""
  };
  CarRegistrationLabel.findAll({ where: { CarRegistrationId: regIds }, include: [{ model: CarPageLabel, where: {IsActive: true}, attributes: labelAttributes }] })
    .then((res) => {
      if (res.length > 0) {
        result.returnCode = 1;
        result.returnMessage = "Car Registration labels have been loaded";
        result.data = res;
      }
      else {
        result.returnMessage = "Something went wrong!";
      }
      response.json(result);
    })
    .catch((err) => {
      console.log(err);
      response.send(err);
    });
});

module.exports = router;
