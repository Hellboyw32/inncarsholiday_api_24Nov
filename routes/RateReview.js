var express = require("express");
const {
    RateReview,
    CarRental
} = require("../config/database");
var router = express.Router();
const Op = require("sequelize").Op;
var Sequelize = require("sequelize");

//All RateReviews
router.get("/getByUser", function (request, response) {
    debugger
    var filterQuery = "SELECT * FROM RateReview as rr left join DriverDetail as dd on rr.CarRentalId=dd.CarRentalId"
        + " where Email='" + request.query.email + "'";

    var result = { returnCode: 0, data: null, returnMessage: "" };
    RateReview.sequelize
        .query(filterQuery, { type: Sequelize.QueryTypes.SELECT }
        ).then(RateReviews => {
            result.data = RateReviews;
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



router.get("/", function (request, response) {
    debugger
    var filterQuery = "SELECT reg.VenderId as VendorId,AVG(rr.Rating) AS AvgRating FROM RateReview rr left join CarRental as cr"
        + " on rr.CarRentalId=cr.Id left join CarRegistration as reg"
        + " on cr.CarRegistrationId=reg.Id"
        + " Group by reg.VenderId;";

    var result = { returnCode: 0, data: null, returnMessage: "" };
    RateReview.sequelize
        .query(filterQuery, { type: Sequelize.QueryTypes.SELECT }
        ).then(RateReviews => {
            result.data = RateReviews;
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

router.get("/paging/admin", function (request, response) {
    var pageSize = request.query.page_size;
    var page = request.query.page;

    var filterQuery = "SELECT *, rr.Id as MainId FROM RateReview rr left join CarRental as cr"
        + " on rr.CarRentalId=cr.Id left join CarRegistration as reg"
        + " on cr.CarRegistrationId=reg.Id"
        + " WHERE rr.IsActive = 1";

    var result = { returnCode: 0, data: null, returnMessage: "" };
    RateReview.sequelize
        .query(filterQuery, { type: Sequelize.QueryTypes.SELECT }
        ).then(RateReviews => {
            result.count = RateReviews.length;
            result.data = RateReviews.slice((page - 1) * pageSize, page * pageSize);
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

//All RateReviews
router.get("/paging/all", function (request, response) {
    debugger
    var pageSize = request.query.page_size;
    var page = request.query.page;
    var result = { returnCode: 0, count: 0, data: null, returnMessage: "" };
    search = {
        where: {}
    }
    if (request.query.search) {
        search.where = {
            Name: { [Op.like]: request.query.search + "%" },
        }
    }
    // else {
    //     search.order.push(['CreatedOn', 'DESC']);
    // }

    RateReview.findAndCountAll({search, include: [CarRental]}).then(RateReviews => {
        debugger
        result.count = RateReviews.count;
        result.data = RateReviews.rows.slice((page - 1) * pageSize, page * pageSize);
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

router.post("/delete/:id", function(request, response){
    var result = {
        returnCode: 0,
        data: null,
        returnMessage: ""
      };
      debugger
      RateReview.findByPk(request.params.id)
        .then(res => {
            debugger
          if (res != null) {
            res.IsActive = false;
            res.save();
            result.data = true;
            result.returnMessage = "Success";
            response.json(result);
          }
        })
        .catch(err => {
            console.log(err);
          result.returnCode = -1;
          result.returnMessage = "Server Error";
          response.json(result);
        });
});

// Add RateReview
router.post("/create", function (request, response) {
    debugger
    var result = { returnCode: 0, data: null, returnMessage: "" };
    RateReview.create(request.body).then(RateReview => {
        result.data = RateReview;
        result.returnMessage = "Success";
        response.json(result)
    }).catch(err => {
        result.returnCode = -1;
        result.returnMessage = "Server Error";
        response.json(result);
    })
});







module.exports = router;
