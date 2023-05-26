var express = require("express");
const { CarType, CarRegistration, CarRentalPrice, CarCity } = require("../config/database");
var Sequelize = require("sequelize");
const TransmissionTypes = require("../config/db/models/TransmissionTypes");

var router = express.Router();

var result = {
  returnCode: 0,
  data: null,
  returnMessage: "",
};

//Get all the Data
router.get("/all", (req, res) => {
  CarType.findAll({ where: { IsActive: true }, order: ['Order'] })
    .then((cartype) => {
      if (cartype != null) {
        result.returnCode = 1;
        result.data = cartype;
        result.returnMessage = "Successfull";
        return res.json(result);
      }
    })
    .catch((err) => {
      result.returnCode = -1;
      result.returnMessage("Server Error");
      return res.json(result);
    });
});

router.get("/typeswithminprices", (req, res) => {
  CarRentalPrice.findAll({
    where: { IsActive: true },
    include: [
      {
        model: CarRegistration,
        required: true,
        include: [
          {
            model: CarType,
            where: {
              IsActive: true
            },
            required: true,
            include: [
              {
                model: TransmissionTypes,
              },
            ],
          },
        ],
      },
    ],
    attributes: [[Sequelize.fn("min", Sequelize.col("Price")), "Price"]],
    group: ["CarRegistration.CarTypeId"],
    order: [[Sequelize.literal('`CarRegistration->CarType`.`Order`'), 'ASC']],
    raw: true,
    nest: true
  })
    .then((cartype) => {
      if (cartype != null) {
        result.returnCode = 1;
        result.data = cartype;
        result.returnMessage = "Successfull";
        return res.json(result);
      }
    })
    .catch((err) => {
      console.log(err);
      result.returnCode = -1;
      result.returnMessage = "Server Error";
      return res.json(result);
    });
});

//get by Id
router.get("/:Id", (req, res) => {
  CarType.findByPk(req.params.Id)
    .then((cartype) => {
      if (cartype != null) {
        result.returnCode = 1;
        result.returnMessage = "Success";
        result.data = cartype;
        return res.json(cartype);
      }
    })
    .catch((err) => {
      result.returnCode = -1;
      result.returnMessage = "Server Error";
      return res.json(result);
    });
});

//Save the data

router.post("/save", (req, res) => {
  CarType.create(req.body)
    .then((cartype) => {
      result.data = cartype;
      result.returnMessage = "Sucess";
      result.returnCode = 1;
      return res.json(result);
    })
    .catch((err) => {
      result.returnMessage = "Server Error";
      result.returnCode = -1;
      return res.json(result);
    });
});

//update data

router.post("/update", (req, response) => {
  CarType.findByPk(req.body.Id)
    .then((cartype) => {
      cartype.Name = req.body.Name;
      cartype.Image = req.body.Image;
      cartype.Capacity = req.body.Capacity;
      cartype.Doors = req.body.Doors;
      cartype.TransmissionTypeId = req.body.TransmissionTypeId;
      cartype.LargeImage = req.body.LargeImage;
      cartype.SmallImage = req.body.SmallImage;
      cartype.InsuranceTC = req.body.InsuranceTC;
      cartype.InsuranceTC_French = req.body.InsuranceTC_French;
      cartype.IsActive = req.body.IsActive;
      cartype.ExcessAmount = req.body.ExcessAmount;
      cartype.GuaranteeAmount = req.body.GuaranteeAmount;
      cartype.MinDriverAge = req.body.MinDriverAge;
      cartype.save().then(() => {
        result.returnCode = 1;
        result.data = cartype;
        result.returnMessage = "Updated!";
      })
        .catch(() => {
          result.returnCode = -1;
          result.data = false;
          result.returnMessage = "Something went wrong!";
        })
        .finally(() => {
          response.json(result);
        });
    })
    .catch((err) => {
      result.returnMessage = "server error";
      result.returnCode = -1;
      response.json(result);
    });
});
// Delete data
router.post("/delete/:Id", (req, res) => {
  CarType.findByPk(req.params.Id)
    .then((cartype) => {
      if (cartype != null) {
        cartype.IsActive = false;
        cartype.save().then(() => {
          result.returnMessage = "Success";
          result.returnCode = 1;
          return res.json(result);
        })
      } else {
        result.returnMessage("User not Found");
        return res.json(result);
      }
    })
    .catch((err) => {
      result.returnMessage = "server Error";
      result.returnCode = -1;
      return res.json(result);
    });
});

router.get("/allwithpricings", (req, res) => {
  CarType.findAll({})
    .then((cartype) => {
      if (cartype != null) {
        result.returnCode = 1;
        result.data = cartype;
        result.returnMessage = "Successfull";
        return res.json(result);
      }
    })
    .catch((err) => {
      result.returnCode = -1;
      result.returnMessage("Server Error");
      return res.json(result);
    });
});

router.put("/update/all", function (request, response) {
  let result = {
    data: null,
    returnCode: 0,
    returnMessage: "Request not processed.",
  };
  console.log(request.body)
  // Position: request.body.Position,
  CarType.bulkCreate(request.body, { updateOnDuplicate: ["Order"] })
    .then(() => {
      result.returnCode = 1;
      result.returnMessage = "CarType updated successfully!";
      response.json(result);
    })
    .catch((error) => {
      console.log(error);
      result.returnCode = -1;
      result.returnMessage = "Banner wasn't updated. Try again, please.";
      response.json(result);
    });
});

module.exports = router;


// router.get("/typeswithminpricesandcity", (req, res) => {
//   CarType.findAll({
//     include: [
//       {
//         model: CarRegistration,
//         required: true,
//         // where: { IsActive: true, Id: [] },
//         include: [
//           { model: CarRentalPrice, required: true },
//           {
//             model: CarCity,
//             attributes: [["CarRegistrationId", "CityCarRegId"]],
//           },
//         ],
//       },
//       {
//         model: TransmissionTypes,
//       },
//     ],
//     attributes: [
//       [Sequelize.fn("min", Sequelize.col("Price")), "Price"],
//       "Name",
//       "Image",
//       "Capacity",
//       "Doors",
//     ],
//     group: [
//       CarRentalPrice.sequelize.col(
//         "CarRegistrations.CarRentalPrice.CarRegistrationId"
//       ),
//     ],
//     raw: true,
//     nest: true,
//   })
//     .then((cartype) => {
//       if (cartype != null) {
//         result.returnCode = 1;
//         result.data = cartype;
//         result.returnMessage = "Successfull";
//         return res.json(result);
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//       result.returnCode = -1;
//       result.returnMessage = "Server Error";
//       return res.json(result);
//     });
// });


// router.get("/typeswithminprices", (req, res) => {
//   CarType.findAll({
//     include: [
//       {
//         model: CarRegistration,
//         required: true,
//         include: [{ model: CarRentalPrice, required: true }],
//       },
//       {
//         model: TransmissionTypes
//       },
//     ],
//     attributes: [[Sequelize.fn("min", Sequelize.col("CarRegistrations.CarRentalPrice.Price")), 'Price'], 'Name', 'Image', 'Capacity', 'Doors'],
//     group: ["CarRegistrationId"],
//     raw: true
//   })
//     .then((cartype) => {
//       if (cartype != null) {
//         result.returnCode = 1;
//         result.data = cartype;
//         result.returnMessage = "Successfull";
//         return res.json(result);
//       }
//     })
//     .catch((err) => {
//       result.returnCode = -1;
//       result.returnMessage = "Server Error";
//       return res.json(result);
//     });
// });