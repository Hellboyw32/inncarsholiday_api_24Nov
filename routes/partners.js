var express = require("express");
const { Partners } = require("../config/database");
var router = express.Router();
const Op = require("sequelize").Op;

async function getAllPartners() {
  let result = {};
  await Partners.findAll({ where: { IsActive: true } })
    .then((data) => {
      result.returnCode = 1;
      if (data && data.length > 0) {
        result.data = data;
        result.returnMessage = "Partners successfully loaded!";
      } else {
        result.returnMessage = "No Partners found!";
      }
    })
    .catch((error) => {
      result.returnCode = -1;
      result.returnMessage = "Server error occured!";
    });
  return result;
}

router.get("/", function (request, response) {
  getAllPartners().then((data) => {
    response.json(data);
  });
});

router.post("/create", function (request, response) {
  let result = {
    data: null,
    returnCode: 0,
    returnMessage: "Request not processed.",
    serverError: null,
  };
  Partners.create(request.body)
    .then(() => {
      result.returnCode = 1;
      result.returnMessage = "Partner added successfully!";
      getAllPartners().then((data) => {
        result.data = data.data;
        response.json(result);
      });
    })
    .catch((error) => {
      result.returnCode = -1;
      result.returnMessage = "Something went wrong!, try again.";
      result.serverError = error;
      response.json(result);
    });
});

router.delete("/delete/:id", function (request, response) {
  let result = {
    data: null,
    returnCode: 0,
    returnMessage: "Request not processed.",
  };

  Partners.update({ IsActive: false }, { where: { Id: request.params.id } })
    .then(() => {
      result.returnCode = 1;
      result.returnMessage = "Partner deleted successfully!";
      getAllPartners().then((partnerList) => {
        result.data = partnerList.data;
        response.json(result);
      });
    })
    .catch(() => {
      result.returnCode = -1;
      result.returnMessage = "Partner wasn't updated. Try again, please.";
      response.json(result);
    });
});

router.put("/update/:id", function (request, response) {
  let result = {
    data: null,
    returnCode: 0,
    returnMessage: "Request not processed.",
  };

  Partners.update(
    {
      ImagePath: request.body.ImagePath,
    },
    { where: { Id: request.params.id } }
  )
    .then(() => {
      result.returnCode = 1;
      result.returnMessage = "Partner updated successfully!";
      getAllPartners().then((partnerList) => {
        result.data = partnerList.data;
        response.json(result);
      });
    })
    .catch(() => {
      result.returnCode = -1;
      result.returnMessage = "Partner wasn't updated. Try again, please.";
      response.json(result);
    });
});

module.exports = router;
