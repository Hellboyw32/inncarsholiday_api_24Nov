var express = require("express");
const { Sliders } = require("../config/database");
var router = express.Router();
const Op = require("sequelize").Op;

async function getAllSliders() {
  let result = {};
  await Sliders.findAll({ where: { IsActive: true } })
    .then((data) => {
      result.returnCode = 1;
      if (data && data.length > 0) {
        result.data = data;
        result.returnMessage = "Sliders successfully loaded!";
      } else {
        result.returnMessage = "No sliders found!";
      }
    })
    .catch((error) => {
      result.returnCode = -1;
      result.returnMessage = "Server error occured!";
    });
  return result;
}

router.get("/", function (request, response) {
  getAllSliders().then((data) => {
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
  Sliders.create(request.body)
    .then(() => {
      result.returnCode = 1;
      result.returnMessage = "Slider added successfully!";
      getAllSliders().then((data) => {
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

  Sliders.update({ IsActive: false }, { where: { Id: request.params.id } })
    .then(() => {
      result.returnCode = 1;
      result.returnMessage = "Slider deleted successfully!";
      getAllSliders().then((sliderList) => {
        result.data = sliderList.data;
        response.json(result);
      });
    })
    .catch(() => {
      result.returnCode = -1;
      result.returnMessage = "Slider wasn't updated. Try again, please.";
      response.json(result);
    });
});

router.put("/update/:id", function (request, response) {
  let result = {
    data: null,
    returnCode: 0,
    returnMessage: "Request not processed.",
  };

  Sliders.update(
    {
      ImagePath: request.body.ImagePath,
      FromDateTime: request.body.FromDateTime,
      ToDateTime: request.body.ToDateTime,
    },
    { where: { Id: request.params.id } }
  )
    .then(() => {
      result.returnCode = 1;
      result.returnMessage = "Slider updated successfully!";
      getAllSliders().then((sliderList) => {
        result.data = sliderList.data;
        response.json(result);
      });
    })
    .catch(() => {
      result.returnCode = -1;
      result.returnMessage = "Slider wasn't updated. Try again, please.";
      response.json(result);
    });
});

module.exports = router;
