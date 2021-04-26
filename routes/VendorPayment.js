var express = require("express");
const {
  Agency,
  CarRental,
  CarRegistration,
  VendorPayment,
  VendorPaymentSummary,
} = require("../config/database");
const Op = require("sequelize").Op;
var router = express.Router();

router.get("/getallpayments", function (request, response) {
  var result = {
    count: 0,
    returnCode: 0,
    data: null,
    returnMessage: "",
  };
  // { model: VendorPaymentSummary},
  const offset =
    parseInt(request.query.page - 1) * parseInt(request.query.pageSize);
  const limit = parseInt(request.query.pageSize);
  VendorPayment.findAndCountAll({
    limit,
    offset,
    where: { IsActive: true },
    include: [
      {
        model: CarRental,
        include: [
          { model: CarRegistration, include: [{ model: Agency }] },
        ],
      },
    ],
  })
    .then((res) => {
      result.returnCode = 1;
      result.returnMessage = "Successfull";
      result.count = res.count;
      result.data = res.rows;
      response.json(result);
    })
    .catch((err) => {
      console.log(err);
      result.returnCode = -1;
      result.returnMessage = err;
      response.json(result);
    });
});

router.post("/addpayment", function (request, response) {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: "",
  };
  VendorPaymentSummary.create(request.body)
    .then((res) => {
      debugger;
      result.returnCode = 0;
      result.data = res;
      result.returnMessage = "Success";
      response.json(result);
    })
    .catch((err) => {
      debugger;
      result.returnCode = -1;
      result.returnMessage = "Server Error";
      response.json(result);
    });
});

router.post("/updatepayment/:id", function (request, response) {
  debugger;
  var result = { returnCode: 0, data: null, returnMessage: "" };
  VendorPayment.findByPk(request.params.id)
    .then((res) => {
      if (res != null) {
        res.DueAmount = request.body.DueAmount;
        res.save().then(() => {
          result.data = res;
          result.returnMessage = "Success";
          response.json(result);
        }).catch((err) => {
          response.send(err);
        });
      } else {
        result.returnCode = -1;
        result.returnMessage = "FooterUrl not found";
        response.json(result);
      }
    })
    .catch((err) => {
      response.send(err);
    });
});

//Get all FooterData
router.get("/getFooterUrlData", function (request, responce) {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: "",
  };
  FooterUrl.findAll({ where: { IsActive: true } })
    .then((response) => {
      result.returnCode = 1;
      result.returnMessage = "Successfull";
      result.data = response;
      responce.json(result);
    })
    .catch((err) => {
      result.returnCode = -1;
      result.returnMessage = "server Error";
      responce.json(result);
    });
});

router.get("/getAllFooterUrlData", function (request, responce) {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: "",
  };
  FooterUrldata.findAll({
    where: { IsActive: true },
    include: [{ model: FooterUrl }],
  })
    .then((response) => {
      result.returnCode = 1;
      result.returnMessage = "Successfull";
      result.data = response;
      responce.json(result);
    })
    .catch((err) => {
      result.returnCode = -1;
      result.returnMessage = err;
      responce.json(result);
    });
});

router.get("/getFooterUrlDataByFooterURLID/:Id", function (request, response) {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: "",
  };
  var Id = parseInt(request.params.Id);
  FooterUrldata.findAll({ where: { FooterUrlId: Id, IsActive: true } })
    .then((res) => {
      if (res.length > 0) {
        result.returnCode = 0;
        result.returnMessage = "Success";
        result.data = res;
        response.json(result);
      } else {
        result.returnCode = 0;
        result.returnMessage = "Didn't find any!";
        result.data = null;
        response.json(result);
      }
    })
    .catch((error) => {
      result.returnCode = -1;
      result.returnMessage = "Something went wrong!";
      result.data = error;
      response.json(result);
    });
});

router.get("/checkfooterurlbyid/:id", function (request, response) {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: "",
  };
  var Id = parseInt(request.params.id);
  FooterUrldata.findAll({ where: { FooterUrlId: Id } })
    .then((res) => {
      if (res.length > 0) {
        result.returnCode = 0;
        result.returnMessage = "Success";
        result.data = res;
        response.json(result);
      } else {
        result.returnCode = 0;
        result.returnMessage = "Didn't find any!";
        result.data = null;
        response.json(result);
      }
    })
    .catch((error) => {
      result.returnCode = -1;
      result.returnMessage = "Something went wrong!";
      result.data = error;
      response.json(result);
    });
});

router.get("/getAllFooterURL", function (request, responce) {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: "",
  };
  FooterUrl.findAll({
    where: { IsActive: true },
    include: [{ model: FooterHeader }],
  })
    .then((response) => {
      result.returnCode = 1;
      result.returnMessage = "Successfull";
      result.data = response;
      responce.json(result);
    })
    .catch((err) => {
      result.returnCode = -1;
      result.returnMessage = err;
      responce.json(result);
    });
});

router.get("/getfooterurlbyid/:id", function (request, response) {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: "",
  };
  FooterUrl.findByPk(request.params.id)
    .then((res) => {
      debugger;
      if (res) {
        result.data = res;
        result.returnCode = 0;
        response.json(result);
      } else {
        result.returnCode = -1;
        result.returnMessage = "User not found";
        response.json(result);
      }
    })
    .catch((err) => {
      response.send(err);
    });
});

router.post("/createFooterHeader", function (request, response) {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: "",
  };
  FooterHeader.create(request.body)
    .then((res) => {
      debugger;
      result.returnCode = 0;
      result.data = res;
      result.returnMessage = "Success";
      response.json(result);
    })
    .catch((err) => {
      debugger;
      result.returnCode = -1;
      result.returnMessage = "Server Error";
      response.json(result);
    });
});

router.post("/createFooterUrl", function (request, response) {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: "",
  };
  FooterUrl.create(request.body)
    .then((res) => {
      debugger;
      result.returnCode = 0;
      result.data = res;
      result.returnMessage = "Success";
      response.json(result);
    })
    .catch((err) => {
      debugger;
      result.returnCode = -1;
      result.returnMessage = "Server Error";
      response.json(result);
    });
});

router.post("/deactivatefooterurl/:Id", function (request, response) {
  //debugger
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: "",
  };
  FooterUrl.findByPk(request.params.Id)
    .then((res) => {
      if (res != null) {
        res.IsActive = false;
        res.save();
        result.returnMessage = "Success";
      } else {
        result.returnCode = -1;
        result.returnMessage = "User not found";
      }
      response.json(result);
    })
    .catch((err) => {
      response.send(err);
    });
});

// Add user
router.post("/create", function (request, response) {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: "",
  };
  FooterUrldata.create(request.body)
    .then((res) => {
      debugger;
      result.returnCode = 0;
      result.data = res;
      result.returnMessage = "Success";
      response.json(result);
    })
    .catch((err) => {
      debugger;
      result.returnCode = -1;
      result.returnMessage = "Server Error";
      response.json(result);
    });
});

router.post("/updatefooterurl/:id", function (request, response) {
  debugger;
  var result = { returnCode: 0, data: null, returnMessage: "" };
  FooterUrl.findByPk(request.params.id)
    .then((res) => {
      if (res != null) {
        res.Name = request.body.Name;
        res.FooterHeaderId = request.body.FooterHeaderId;
        res.Url = request.body.Url;
        res.save();
        result.data = res;
        result.returnMessage = "Success";
      } else {
        result.returnCode = -1;
        result.returnMessage = "FooterUrl not found";
      }
      response.json(result);
    })
    .catch((err) => {
      response.send(err);
    });
});

module.exports = router;
