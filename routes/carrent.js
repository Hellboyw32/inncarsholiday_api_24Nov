var express = require("express");
const {
  Agency,
  VendorPayment,
  CarRental,
  CarModel,
  CarRentalPrice,
  CarRegistration,
  PaymentStatus,
  BookingStatus,
  Locality,
  User,
  UserProfile,
  DriverDetail,
  CarRentalOptionalCover,
  OptionalCover,
  City,
  CarMake,
  BookedPercentage,
  CarBookingStats,
  TransmissionTypes
} = require("../config/database");
var router = express.Router();
var Sequelize = require("sequelize");
const axios = require('axios')
const https = require('https');
const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});
//All
router.get("/", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  CarRental.findAll({
    where: { IsActive: true },
    include: [
      { model: BookingStatus },
      { model: PaymentStatus },
      {
        model: CarRentalOptionalCover,
        include: [{ model: OptionalCover }],
      },
      {
        model: CarRegistration,
        include: [
          {
            model: CarModel,
            include: [{ model: CarMake }],
          },
          {
            model: CarRentalPrice,
          },
          {
            model: User,
            include: [
              {
                model: UserProfile,
              },
            ],
          },
        ],
      },
      {
        model: Locality,
        include: [{ model: City }],
      },
    ],
  })
    .then((res) => {
      result.data = res;
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

function converToFormat(date) {
  var year = date.getFullYear().toString();
  var month = (date.getMonth() + 1).toString();
  var day = date.getDate().toString();
  if (month.length == 1) month = "0" + month;
  return year + "-" + month + "-" + day;
}

function getQueryForTimePeriodFilter(request) {
  var query = "";
  query =
    "SELECT Sum(BookingAmount) as TotalAmount,Sum(AmountPaid) as ReceiveAmount,Count(Id) as TotalSale FROM CarRental";
  query += " Where BookedStatusId=" + request.body.Status;

  var date = new Date(),
    y = date.getFullYear(),
    m = date.getMonth();
  console.log("is this correct date", date);
  var firstDayOfMonth = new Date(y, m, 1);
  var lastDayOfMonth = new Date(y, m + 1, 0);

  if (request.body.Period === "today")
    query +=
      " and Date(CreatedOn) >='" +
      converToFormat(date) +
      "' and Date(CreatedOn) <='" +
      converToFormat(date) +
      "'";

  var diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
  var startOfWeek = new Date(date.setDate(diff));

  if (request.body.Period === "week")
    query +=
      " and Date(CreatedOn) >='" +
      converToFormat(startOfWeek) +
      "' and Date(CreatedOn) <='" +
      converToFormat(date) +
      "'";

  if (request.body.Period === "month")
    query +=
      " and Date(CreatedOn) >='" +
      converToFormat(firstDayOfMonth) +
      "' and Date(CreatedOn) <='" +
      converToFormat(lastDayOfMonth) +
      "'";
  return query;
}

//All for dashboard
router.post("/dashboard", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  var query = "";
  if (request.body.From && request.body.To) {
    query = "";
    query =
      "SELECT Sum(BookingAmount) as TotalAmount,Sum(AmountPaid) as ReceiveAmount,Count(Id) as TotalSale FROM CarRental";
    query += " Where BookedStatusId=" + request.body.Status;
    query +=
      " and Date(CreatedOn) >='" +
      converToFormat(new Date(request.body.From)) +
      "' and Date(CreatedOn) <='" +
      converToFormat(new Date(request.body.To)) +
      "'";
  } else {
    query = getQueryForTimePeriodFilter(request);
  }

  CarRental.sequelize
    .query(query, { type: Sequelize.QueryTypes.SELECT })
    .then((res) => {
      result.data = res;
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

//All  By paging
router.get("/paging/all", function (request, response) {
  var pageSize = request.query.page_size;
  var page = request.query.page;
  var result = { returnCode: 0, count: 0, data: null, returnMessage: "" };

  CarRental.findAndCountAll({
    where: { IsActive: true },
    include: [
      { model: BookingStatus },
      { model: PaymentStatus },
      { model: CarRegistration, required: true, include: [{ model: CarModel, where: {IsActive: true } }] },
      { model: User, include: [{ model: UserProfile }] },
    ],
    order: [["CreatedOn", "DESC"]],
  })
    .then((res) => {
      result.count = res.rows.length;
      result.data = res.rows.slice((page - 1) * pageSize, page * pageSize);
      result.returnCode = 0;
      result.returnMessage = "Success";
      response.json(result);
    })
    .catch((error) => {
      result.returnCode = -1;
      result.returnMessage = "Server Error";
      response.json(result);
      return;
    });
});

//All By agency paging

router.get("/byagency/paging/all", function (request, response) {
  var pageSize = request.query.page_size;
  var page = request.query.page;
  var AgencyId = request.query.agency;
  var result = { returnCode: 0, count: 0, data: null, returnMessage: "" };

  CarRental.findAndCountAll({
    where: { IsActive: true, BookedById: AgencyId },
    include: [
      { model: BookingStatus },
      { model: PaymentStatus },
      { model: CarRegistration, include: [{ model: CarModel }] },
      { model: User, include: [{ model: UserProfile }] },
    ],
    order: [["CreatedOn", "DESC"]],
  })
    .then((res) => {
      result.count = res.rows.length;
      result.data = res.rows.slice((page - 1) * pageSize, page * pageSize);
      result.returnCode = 0;
      result.returnMessage = "Success";
      response.json(result);
    })
    .catch((error) => {
      result.returnCode = -1;
      result.returnMessage = "Server Error";
      response.json(result);
      return;
    });
});

//Get By Id
router.get("/:id", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  CarRental.findByPk(request.params.id, {
    include: [
      {
        model: CarRentalPrice,
      },
      { model: DriverDetail },
      {
        model: Locality,
        as: "PickUpLocation",
        include: [{ model: City }],
      },
      {
        model: Locality,
        as: "DropOffLocation",
        include: [{ model: City }],
      },
      {
        model: CarRentalOptionalCover,
        include: [{ model: OptionalCover }],
      },
      {
        model: CarRegistration,
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
          {
            model: CarModel,
            include: [{ model: CarMake }],
          },
        ],
      },
    ],
  })
    .then((res) => {
      if (res != null) {
        console.log(res);
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

function checkIfPercentageExpired(percentage) {
  var timeToComapre = new Date();
  var olderDate = new Date(
    percentage.Date.setHours(percentage.Date.getHours() + 1)
  );
  if (percentage && olderDate > timeToComapre) return percentage;
  else {
    percentage.Percentage = getRandomNumber(70, 85);
    percentage.Date = new Date();
    updatePercentage(percentage);
    return percentage;
  }
}

function updatePercentage(percentage) {
  BookedPercentage.findByPk(percentage.Id)
    .then((res) => {
      if (res != null) {
        res.Percentage = percentage.Percentage;
        res.Date = percentage.Date;
        res.save();
        return res;
      }
    })
    .catch((err) => { });
}

function getRandomNumber(minimum, maximum) {
  return Math.floor(Math.random() * (+maximum - +minimum)) + +minimum;
}

//Get By location
router.get("/getBookedPercentageByLocation/:id", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  BookedPercentage.findAll({ where: { LocationId: request.params.id } })
    .then((res) => {
      if (res != null && res.length > 0) {
        var percentage = checkIfPercentageExpired(res[0].dataValues);
        result.data = percentage;
        result.returnCode = 1;
        result.returnMessage = "successfull";
        response.json(result);
      } else {
        var model = {
          Percentage: getRandomNumber(70, 85),
          LocationId: request.params.id,
          Date: new Date(),
        };
        var percentage = addNewToBookedPercentage(model);
        result.data = model;
        result.returnCode = 1;
        result.returnMessage = "successfull";
        response.json(result);
      }
    })
    .catch((err) => {
      response.send(err);
    });
});

router.get("/getdriverdetailsbyrentalid/:id", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  DriverDetail.findAll({ where: { CarRentalId: request.params.id } })
    .then((res) => {
      if (res != null && res.length > 0) {
        result.data = res;
        result.returnCode = 1;
        result.returnMessage = "successfull";
        response.json(result);
      }
    })
    .catch((err) => {
      response.send(err);
    });
});

function checkIfBookingExpired(bookingData) {
  var timeToComapre = new Date();
  var prevDateFor30 = bookingData.Date;
  var prevDateFor1440 = bookingData.Date;
  var olderDate = new Date(
    prevDateFor30.setMinutes(prevDateFor30.getMinutes() + 30)
  );

  if (bookingData && olderDate > timeToComapre) {
    return bookingData;
  } else {
    var IncreasedTime = new Date(
      prevDateFor1440.setMinutes(prevDateFor1440.getMinutes() + 1440)
    );

    if (IncreasedTime < timeToComapre) bookingData.BookingTimes = 18;

    bookingData.BookingTimes = getRandomNumber(
      bookingData.BookingTimes,
      bookingData.BookingTimes + 15
    );
    bookingData.LookedAt = getRandomNumber(22, 34);
    bookingData.LastBookingTime = new Date(
      timeToComapre.setMinutes(
        timeToComapre.getMinutes() + -getRandomNumber(22, 55)
      )
    );
    bookingData.Date = new Date();
    updateBookingData(bookingData);
    return bookingData;
  }
}

function checkForLastBookking(bookingData, timeToComapre) {
  var lastBookingTime = new Date(
    bookingData.Date.setMinutes(bookingData.Date.getMinutes() + 30)
  );
  if (bookingData && lastBookingTime > timeToComapre) {
    return bookingData;
  } else {
    bookingData.LastBookingTime = new Date();
    bookingData.Date = new Date();
    updateBookingData(bookingData);
    return bookingData;
  }
}

function updateBookingData(bookingData) {
  CarBookingStats.findByPk(bookingData.Id)
    .then((res) => {
      if (res != null) {
        res.LastBookingTime = bookingData.LastBookingTime;
        res.BookingTimes = bookingData.BookingTimes;
        res.Date = bookingData.Date;
        res.save();
        return res;
      }
    })
    .catch((err) => { });
}

//Get By location
router.get("/getCarBookingStats/:id", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  CarBookingStats.findAll({ where: { CarId: request.params.id } })
    .then((res) => {
      if (res != null && res.length > 0) {
        var percentage = checkIfBookingExpired(res[0].dataValues);
        result.data = percentage;
        result.returnCode = 1;
        result.returnMessage = "successfull";
        response.json(result);
      } else {
        var timeforBooking = new Date();
        var model = {
          LastBookingTime: new Date(
            timeforBooking.setMinutes(
              timeforBooking.getMinutes() + -getRandomNumber(22, 55)
            )
          ),
          BookingTimes: getRandomNumber(13, 24),
          Date: new Date(),
          CarId: request.params.id,
          LookedAt: getRandomNumber(22, 34),
        };
        var percentage = addNewToBookingStats(model);
        result.data = model;
        result.returnCode = 1;
        result.returnMessage = "successfull";
        response.json(result);
      }
    })
    .catch((err) => {
      response.send(err);
    });
});

function addNewToBookingStats(bookingData) {
  CarBookingStats.create(bookingData)
    .then((res) => {
      if (res != null) {
        return res;
      }
    })
    .catch((err) => {
      response.send(err);
    });
}

function addNewToBookedPercentage(model) {
  BookedPercentage.create(model)
    .then((res) => {
      if (res != null) {
        return res;
      }
    })
    .catch((err) => {
      response.send(err);
    });
}

//All By user
router.post("/getByUser", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  CarRental.findAll({
    where: { IsActive: true },
    order: [["Id", "DESC"]],
    include: [
      {
        model: CarRentalPrice,
        where: { IsActive: true }
      },
      { model: BookingStatus },
      { model: PaymentStatus },
      {
        model: DriverDetail,
        where: { Email: request.body.Email },
      },
      {
        model: CarRentalOptionalCover,
        include: [{ model: OptionalCover }],
      },
      {
        model: CarRegistration,
        include: [
          {
            model: CarModel,
            include: [{ model: CarMake }, { model: TransmissionTypes }],
          },
          {
            model: Agency,
          },
        ],
      },
      {
        model: Locality,
        as: "PickUpLocation",
        include: [{ model: City }],
      },
      {
        model: Locality,
        as: "DropOffLocation",
        include: [{ model: City }],
      },
    ],
  })
    .then((res) => {
      result.data = res;
      if (!request.body.IsValid) {
        var exist = result.data.filter(
          (b) => b.BookingId == request.body.BookingId
        );
        if (exist.length == 0) result.data = [];
      }
      result.returnMessage = "Success";
      response.json(result);
      return;
    })
    .catch((error) => {
      console.log(error);
      result.returnCode = -1;
      result.returnMessage = "Server Error";
      response.json(result);
      return;
    });
});

router.post("/create", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  var bookingId = "MC" + Math.floor(1000 + Math.random() * 9000);
  var agencyBookingId = null;
  if (request.body.AgencyBookingId && request.body.AgencyBookingId != "")
    agencyBookingId =
      request.body.AgencyBookingId + Math.floor(1000 + Math.random() * 9000);
  CarRental.create(request.body, { include: [{ model: DriverDetail }] })
    .then((res) => {
      optionalCover(res.Id, request.body.ExtraOptional);
      res.BookingId = bookingId + "A" + res.Id;
      if (agencyBookingId) res.AgencyBookingId = agencyBookingId + "A" + res.Id;
      res.save().then(() => {
        if (request.body.PaymentStatusId == 2) postExternalDB(res.Id);
        result.data = res;
        result.returnMessage = "Success";
        response.json(result);
      })
    })
    .catch((err) => {
      console.log(err);
      result.returnCode = -1;
      result.returnMessage = "Server Error";
      response.json(result);
    });
});

function optionalCover(id, model) {
  model.forEach((element) => {
    var obj = {};
    obj.CarRentalId = id;
    obj.OptionalCoverId = element.Id;
    obj.OptionalValue = element.OptionalValue;
    obj.Amount = element.Amount;
    obj.IsActive = true;
    obj.CreatedOn = new Date();
    CarRentalOptionalCover.create(obj);
  });
}

router.post("/update/:id", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  CarRental.findByPk(request.params.id)
    .then((res) => {
      if (res != null) {
        res.CarRegistrationId = request.body.CarRegistrationId;
        res.BookingFrom = request.body.BookingFrom;
        res.BookingTo = request.body.BookingTo;
        res.PickUpLocationId = request.body.PickUpLocationId;
        res.BookingAmount = request.body.BookingAmount;
        res.AmountPaid = request.body.AmountPaid;
        res.BookedTo = request.body.BookedTo;
        // res.BookedById = request.body.BookedById;
        res.PaymentStatusId = request.body.PaymentStatusId;
        res.BookedStatusId = request.body.BookedStatusId;
        res.IsActive = true;
        res.CreatedOn = request.body.CreatedOn;
        res.UpdatedOn = request.body.UpdatedOn;
        res.save();
        updateDriver(request.body.DriverDetail);
        UpdateOptionalCover(request.params.id, request.body.ExtraOptional);
        result.data = res;
        result.returnMessage = "Success";
      } else {
        result.returnCode = -1;
        result.returnMessage = "CarRegistration  not found";
      }
      response.json(result);
    })
    .catch((err) => {
      response.send(err);
    });
});

function createVendorPayment(rentalResult) {
  CarRegistration.findByPk(rentalResult.CarRegistrationId).then((res) => {
    if (res) {
      let vpayment = {
        Id: 0,
        CarRentalId: rentalResult.Id,
        UpFrontPaid: rentalResult.AmountPaid,
        Commission: res.ComissionPercentage,
        DueAmount:
          rentalResult.BookingAmount -
          (res.ComissionPercentage / 100) * rentalResult.BookingAmount,
        IsActive: true,
      };
      VendorPayment.create(vpayment).then((pay) => {
        console.log("Vendor payment has been created!", pay);
      });
    }
  }).catch((error) => console.log(error));
}

function postExternalDB(carRentalId) {
  console.log("externalmodel", carRentalId);
  console.log("externalModelId", carRentalId);
  // let totalDays = calculateDays(externalModel.BookingFrom, externalModel.BookingTo);

  DriverDetail.findOne({ where: { CarRentalId: carRentalId }, include: [{ model: CarRental }] }).then((res) => {
    createVendorPayment(res.CarRental);
    let totalDays = calculateDays(res.CarRental.BookingFrom, res.CarRental.BookingTo);
    axiosInstance
      .post("https://api.inncarsholiday.com/api/booking", {
        CreatedBy: res.CarRental.BookedById > 0 ? "Admin" : (res.FirstName + " " + res.LastName),
        CustomerName: res.FirstName + " " + res.LastName,
        ContactDetails: res.Email + ", " + res.PhoneNumber,
        FlightNo: res.FlightNumber,
        PickUpDate: res.CarRental.BookingFrom,
        DropOffDate: res.CarRental.BookingTo,
        Days: totalDays,
        Price: res.CarRental.BookingAmount,
        CategoryId: "3",
        SpecialRequest: "",
        Login: "",
        ReferenceNo: res.CarRental.BookingId,
        Insurance: res.CarRental.IncludeCoverage,
        Currency: "",
        PaymentMethod: "PayPal",
        IsGps: false,
        IsCarSeat: false,
        IsBoosterSeat: false,
        DropOffPlace: "",
      })
      .then((res) => {
        console.log(`statusCode: ${res.statusCode}`);
        console.log(res);
      })
      .catch((error) => {
        console.error(error);
      });
  })
}

router.post("/UpdateTransaction", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  console.log("update transaction body", request.body);
  CarRental.update(
    {
      AmountPaid: request.body.AmountPaid,
      PaymentStatusId: 2,
      BookingStatusId: 1,
    },
    { where: { Id: request.body.Id } }
  )
    .then((res) => {
      if (res != null) {
        postExternalDB(request.body.Id);
        result.data = res;
        result.returnMessage = "Success";
      } else {
        result.returnCode = -1;
        result.returnMessage = "CarRegistration  not found";
      }
      response.json(result);
    })
    .catch((err) => {
      console.log(err);
      response.returnCode = -1;
      result.returnMessage = err;
    });
});

function calculateDays(firstDateParam, secondDateParam) {
  const oneDay = 24 * 60 * 60 * 1000;
  const firstDate = new Date(firstDateParam);
  const lastDate = new Date(secondDateParam);
  firstDate.setHours(0, 0, 0);
  lastDate.setHours(0, 0, 0);
  return Math.round(Math.abs((firstDate - lastDate) / oneDay));
}

function updateDriver(model) {
  DriverDetail.findByPk(model.Id).then((res) => {
    res.FirstName = model.FirstName;
    res.LastName = model.LastName;
    res.Email = model.Email;
    res.PhoneNumber = model.PhoneNumber;
    res.IsDriverAgeDesired = model.IsDriverAgeDesired;
    res.FlightNumber = model.FlightNumber;
    res.UpdatedOn = model.UpdatedOn;
    res.save();
  });
}

function UpdateOptionalCover(Id, model) {
  CarRentalOptionalCover.destroy({ where: { CarRentalId: Id } }).then((res) => {
    model.UpdatedOn = new Date();
    optionalCover(Id, model);
  });
}

router.post("/delete/:id", function (request, response) {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: "",
  };
  CarRental.findByPk(request.params.id)
    .then((res) => {
      if (res != null) {
        res.IsActive = false;
        res.save().then(
          (resSave) => {
            let tempUrl = "https://api.inncarsholiday.com/api/booking?referenceNo=" + res.BookingId;
            deleteVendorPayment(request.params.id);
            axiosInstance
            .delete(tempUrl).then(() => {
              result.data = true;
              result.returnMessage = "Success";
              response.json(result);
            }).catch((error) => {
              result.returnCode = 1;
              result.data = true;
              console.log(error)
              result.returnMessage = "External API error";
              response.json(result);
            })
          },
          (error) => {
            deleteVendorPayment(request.params.id);
            result.data = true;
            result.returnMessage = "Success";
            response.json(result);
          }
        );
      }
    })
    .catch((err) => {
      result.returnCode = -1;
      result.returnMessage = "Server Error";
      response.json(result);
    });
});

router.post("/DeleteByBookingId/:id", function (request, response) {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: "",
  };
  CarRental.findAll({ where: { BookingId: request.params.id } })
    .then((res) => {
      if (res) {
        res.IsActive = false;
        res.save();
        deleteVendorPayment(res.Id);
        result.data = true;
        result.returnMessage = "Success";
        response.json(result);
      }
    })
    .catch((err) => {
      result.returnCode = -1;
      result.returnMessage = "Server Error";
      response.json(result);
    });
});

router.post("/cancelbooking/:id", function (request, response) {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: "",
  };
  CarRental.findByPk(request.params.id)
    .then((res) => {
      if (res != null) {
        let tempUrl = "https://api.inncarsholiday.com/api/booking?referenceNo=" + res.BookingId;
        res.BookedStatusId = 3;
        res.save();
        deleteVendorPayment(request.params.id);
        axiosInstance
        .delete(tempUrl).then(() => {
          result.data = true;
          result.returnMessage = "Success";
          response.json(result);
        }).catch((error) => {
          result.returnCode = 1;
          result.data = true;
          console.log(error)
          result.returnMessage = "External API error";
          response.json(result);
        })
      }
    })
    .catch((err) => {
      result.returnCode = -1;
      result.returnMessage = "Server Error";
      response.json(result);
    });
});

function deleteVendorPayment(rentalId) {
  VendorPayment.findAll({ limit: 1, where: { CarRentalId: rentalId } })
    .then(async (res) => {
      if (res) {
        res[0].IsActive = false;
        await res[0].save();
        return true;
      }
      return true;
    })
    .catch((err) => {
      console.log(err);
      return true;
    });
}

module.exports = router;
