var express = require("express");
const {
  BookingStatus,
  CarRental,
  CarRegistration,
} = require("../config/database");

var router = express.Router();

var result = {
  returnCode: 0,
  data: null,
  returnMessage: "",
};
var Sequelize = require("sequelize");
//Get all the Data
router.get("/all", (req, res) => {
  debugger;
  BookingStatus.findAll({ where: { IsActive: true } })
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

//Get Completed Car Bookings
router.get("/getcompletedbookings", (req, res) => {
  var result = {
    count: 0,
    returnCode: 0,
    data: null,
    returnMessage: "",
  };
  const offset = parseInt(req.query.page - 1) * parseInt(req.query.pageSize);
  const limit = parseInt(req.query.pageSize);
  CarRental.findAndCountAll({
    limit,
    offset,
    where: { IsActive: true, BookedStatusId: 2 },
    order: [["Id", "DESC"]],
    include: [{ model: CarRegistration }],
  })
    .then((res) => {
      if (res != null) {
        result.returnCode = 1;
        result.data = res.rows;
        result.count = res.count;
        result.returnMessage = "Successfull";
        return res.json(result);
      }
    })
    .catch((err) => {
      result.returnCode = -1;
      result.returnMessage = err;
      return res.json(result);
    });
});

//Get Booked Bookings
router.get("/getbookedbookings", (req, res) => {
  var result = {
    count: 0,
    returnCode: 0,
    data: null,
    returnMessage: "",
  };
  const offset = parseInt(req.query.page - 1) * parseInt(req.query.pageSize);
  const limit = parseInt(req.query.pageSize);
  CarRental.findAndCountAll({
    limit,
    offset,
    where: { IsActive: true, BookedStatusId: 1 },
    order: [["Id", "DESC"]],
    include: [{ model: CarRegistration }],
  })
    .then((res) => {
      if (res != null) {
        result.returnCode = 1;
        result.data = res.rows;
        result.count = res.count;
        result.returnMessage = "Successfull";
        return res.json(result);
      }
    })
    .catch((err) => {
      result.returnCode = -1;
      result.returnMessage = err;
      return res.json(result);
    });
});

//Get Filtered Booked Bookings
router.post("/filteredbookedbookings", (req, response) => {
  const limit = parseInt(req.body.page - 1) * parseInt(req.body.pageSize);
  const offset = parseInt(req.body.pageSize);

  if (req.body.From && req.body.To) {
    let result = {};

    let query =
      "SELECT CarRegistration.PlateNo as 'CarRegistration.PlateNo', CarRental.BookingFrom as BookingFrom,";
    query +=
      " CarRental.BookingTo as BookingTo, CarRental.TimeFrom as TimeFrom, CarRental.TimeTo as TimeTo, CarRental.BookingId as BookingId";
    query +=
      " FROM CarRental LEFT JOIN CarRegistration ON CarRental.CarRegistrationId = CarRegistration.Id";
    query += " WHERE Date(CarRental.BookingFrom) >= '" + req.body.From;
    query += "' and Date(CarRental.BookingTo) <= '" + req.body.To;
    query +=
      "' and CarRental.BookedStatusId = 1 and CarRental.IsActive = true ORDER BY CarRental.Id DESC LIMIT " +
      limit +
      "," +
      offset;

    let countQuery = "SELECT COUNT(*) FROM CarRental";
    countQuery += " WHERE Date(CarRental.BookingFrom) >= '" + req.body.From;
    countQuery += "' and Date(CarRental.BookingTo) <= '" + req.body.To;
    countQuery +=
      "' and CarRental.BookedStatusId = 1 and CarRental.IsActive = true;";

    CarRental.sequelize
      .query(query, {
        nest: true,
        type: Sequelize.QueryTypes.SELECT,
      })
      .then((resp) => {
        result.data = resp;
        result.returnMessage = "Success";
        CarRental.sequelize
          .query(countQuery, {
            type: Sequelize.QueryTypes.SELECT,
          })
          .then((cResp) => {
            result.count = cResp[0];
            response.json(result);
          })
          .catch((error) => {});
      })
      .catch((error) => {
        result.returnCode = -1;
        result.returnMessage = "Server Error";
        response.json(result);
      });
  }
});

//get filtered cancelled bookings
router.post("/filteredcancelledbookings", (req, response) => {
  const limit = parseInt(req.body.page - 1) * parseInt(req.body.pageSize);
  const offset = parseInt(req.body.pageSize);

  if (req.body.From && req.body.To) {
    let result = {};

    let query =
      "SELECT CarRegistration.PlateNo as 'CarRegistration.PlateNo', CarRental.BookingFrom as BookingFrom,";
    query +=
      " CarRental.BookingTo as BookingTo, CarRental.TimeFrom as TimeFrom, CarRental.TimeTo as TimeTo, CarRental.BookingId as BookingId";
    query +=
      " FROM phCarRental LEFT JOIN CarRegistration ON CarRental.CarRegistrationId = CarRegistration.Id";
    query += " WHERE Date(CarRental.BookingFrom) >= '" + req.body.From;
    query += "' and Date(CarRental.BookingTo) <= '" + req.body.To;
    query +=
      "' and CarRental.BookedStatusId = 3 and CarRental.IsActive = true ORDER BY CarRental.Id DESC LIMIT " +
      limit +
      "," +
      offset;

    let countQuery = "SELECT COUNT(*) FROM CarRental";
    countQuery += " WHERE Date(CarRental.BookingFrom) >= '" + req.body.From;
    countQuery += "' and Date(CarRental.BookingTo) <= '" + req.body.To;
    countQuery +=
      "' and CarRental.BookedStatusId = 3 and CarRental.IsActive = true;";

    CarRental.sequelize
      .query(query, {
        nest: true,
        type: Sequelize.QueryTypes.SELECT,
      })
      .then((resp) => {
        result.data = resp;
        result.returnMessage = "Success";
        CarRental.sequelize
          .query(countQuery, {
            type: Sequelize.QueryTypes.SELECT,
          })
          .then((cResp) => {
            result.count = cResp[0];
            response.json(result);
          })
          .catch((error) => {});
      })
      .catch((error) => {
        result.returnCode = -1;
        result.returnMessage = "Server Error";
        response.json(result);
      });
  }
});

//get cancelled bookins with paging
router.get("/getcancelledbookings", (req, res) => {
  var result = {
    count: 0,
    returnCode: 0,
    data: null,
    returnMessage: "",
  };
  const offset = parseInt(req.query.page - 1) * parseInt(req.query.pageSize);
  const limit = parseInt(req.query.pageSize);
  CarRental.findAndCountAll({
    limit,
    offset,
    where: { IsActive: true, BookedStatusId: 3 },
    order: [["Id", "DESC"]],
    include: [{ model: CarRegistration }],
  })
    .then((res) => {
      if (res != null) {
        result.returnCode = 1;
        result.data = res.rows;
        result.count = res.count;
        result.returnMessage = "Successfull";
        return res.json(result);
      }
    })
    .catch((err) => {
      result.returnCode = -1;
      result.returnMessage = err;
      return res.json(result);
    });
});

//get filtered completed bookings
router.post("/filteredcompletedbookings", (req, response) => {
  const limit = parseInt(req.body.page - 1) * parseInt(req.body.pageSize);
  const offset = parseInt(req.body.pageSize);

  if (req.body.From && req.body.To) {
    let result = {};

    let query =
      "SELECT CarRegistration.PlateNo as 'CarRegistration.PlateNo', CarRental.BookingFrom as BookingFrom,";
    query +=
      " CarRental.BookingTo as BookingTo, CarRental.TimeFrom as TimeFrom, CarRental.TimeTo as TimeTo, CarRental.BookingId as BookingId";
    query +=
      " FROM CarRental LEFT JOIN CarRegistration ON CarRental.CarRegistrationId = CarRegistration.Id";
    query += " WHERE Date(CarRental.BookingFrom) >= '" + req.body.From;
    query += "' and Date(CarRental.BookingTo) <= '" + req.body.To;
    query +=
      "' and CarRental.BookedStatusId = 2 and CarRental.IsActive = true ORDER BY CarRental.Id DESC LIMIT " +
      limit +
      "," +
      offset;

    let countQuery = "SELECT COUNT(*) FROM CarRental";
    countQuery += " WHERE Date(CarRental.BookingFrom) >= '" + req.body.From;
    countQuery += "' and Date(CarRental.BookingTo) <= '" + req.body.To;
    countQuery +=
      "' and CarRental.BookedStatusId = 2 and CarRental.IsActive = true;";

    CarRental.sequelize
      .query(query, {
        nest: true,
        type: Sequelize.QueryTypes.SELECT,
      })
      .then((resp) => {
        result.data = resp;
        result.returnMessage = "Success";
        CarRental.sequelize
          .query(countQuery, {
            type: Sequelize.QueryTypes.SELECT,
          })
          .then((cResp) => {
            result.count = cResp[0];
            response.json(result);
          })
          .catch((error) => {});
      })
      .catch((error) => {
        console.log(error);
        result.returnCode = -1;
        result.returnMessage = "Server Error";
        response.json(result);
      });
  }
});

router.patch("/togglebooking/:Id/:bookingStatus", (request, response) => {
  let result = { returnCode: 0, returnMessage: null };
  CarRental.update(
    {
      BookedStatusId: +request.params.bookingStatus,
    },
    { where: { Id: request.params.Id } }
  )
    .then(() => {
      result.returnCode = 1;
      response.json(result);
    })
    .catch((err) => {
      console.log(err);
      response.returnCode = -1;
      result.returnMessage = err;
    });
});

module.exports = router;
