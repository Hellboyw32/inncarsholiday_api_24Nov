var express = require("express");
const { CarPageLabel } = require("../config/database");
var router = express.Router();
const Op = require("sequelize").Op;

async function getAllCarPageLabels(carPageLabelId = 0) {
  let result = {};
  let queryParams = { where: { IsActive: true } };
  if (carPageLabelId && carPageLabelId != 0)
    queryParams.where.Id = carPageLabelId;
  await CarPageLabel.findAll(queryParams)
    .then((data) => {
      result.returnCode = 1;
      if (data && data.length > 0) {
        result.data = data;
        result.returnMessage = "Car Page Labels successfully loaded!";
      } else {
        result.returnMessage = "No Location Type Meta found!";
      }
    })
    .catch((error) => {
      console.log(error);
      result.returnCode = -1;
      result.returnMessage = "Server error occured!";
    });
  return result;
}

router.get("/:carPageLabelId?", function (request, response) {
  getAllCarPageLabels(+request.params.carPageLabelId).then((data) => {
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
  CarPageLabel.create(request.body)
    .then(() => {
      result.returnCode = 1;
      result.returnMessage = "Car Page Label added successfully!";
      getAllCarPageLabels().then((data) => {
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

  CarPageLabel.update({ IsActive: false }, { where: { Id: request.params.id } })
    .then(() => {
      result.returnCode = 1;
      result.returnMessage = "Car Page Label deleted successfully!";
      getAllCarPageLabels().then((carPageLabelList) => {
        result.data = carPageLabelList.data;
        response.json(result);
      });
    })
    .catch((error) => {
      console.log(error);
      result.returnCode = -1;
      result.returnMessage =
        "Car Page Label wasn't updated. Try again, please.";
      response.json(result);
    });
});

router.put("/update", function (request, response) {
  let result = {
    data: null,
    returnCode: 0,
    returnMessage: "Request not processed.",
  };
  CarPageLabel.update(
    {
      TypeId: request.body.TypeId,
      Text: request.body.Text,
      TextFrench: request.body.TextFrench,
      ColorCode: request.body.ColorCode,
    },
    { where: { Id: request.body.Id } }
  )
    .then(() => {
      result.returnCode = 1;
      result.returnMessage = "Car Page Label updated successfully!";
      getAllCarPageLabels().then((carPageLabelList) => {
        result.data = carPageLabelList.data;
        response.json(result);
      });
    })
    .catch((error) => {
      console.log(error);
      result.returnCode = -1;
      result.returnMessage =
        "Car Page Label wasn't updated. Try again, please.";
      response.json(result);
    });
});

module.exports = router;
