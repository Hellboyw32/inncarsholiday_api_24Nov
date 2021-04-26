var express = require("express");
const { HomeTexts } = require("../config/database");
var router = express.Router();
const Op = require("sequelize").Op;

async function getAllHomeTexts() {
  let result = {};
  await HomeTexts.findAll({ where: { IsActive: true } })
    .then((data) => {
      result.returnCode = 1;
      if (data && data.length > 0) {
        result.data = data;
        result.returnMessage = "Home Texts successfully loaded!";
      } else {
        result.returnMessage = "No Home Texts found!";
      }
    })
    .catch((error) => {
      result.returnCode = -1;
      result.returnMessage = "Server error occured!";
    });
  return result;
}

router.get("/", function (request, response) {
  getAllHomeTexts().then((data) => {
    response.json(data);
  });
});

router.get("/getfrenchtexts", function (request, response) {
  let result = {
    data: null,
    returnCode: 0,
    returnMessage: "Request not processed.",
    serverError: null,
  };
  HomeTexts.findAll({
    where: { IsActive: true },
    attributes: [
      'TypeId',
      ['UpperTextFrench', 'UpperText'],
      ['LowerTextFrench', 'LowerText'],
    ],
    order: [['TypeId', 'ASC']]
  })
    .then((data) => {
      result.returnCode = 1;
      result.returnMessage = "French texts has been processed!";
      result.data = data;
    })
    .catch((error) => {
      result.returnCode = -1;
      result.returnMessage = "Something went wrong!, try again.";
      result.serverError = error;
    })
    .finally(() => response.json(result));
});

router.get("/getenglishtexts", function (request, response) {
  let result = {
    data: null,
    returnCode: 0,
    returnMessage: "Request not processed.",
    serverError: null,
  };
  HomeTexts.findAll({
    where: { IsActive: true },
    attributes: [
      'TypeId',
      ['UpperTextEnglish', 'UpperText'],
      ['LowerTextEnglish', 'LowerText'],
    ],
    order: [['TypeId', 'ASC']]
  })
    .then((data) => {
      result.returnCode = 1;
      result.returnMessage = "English texts has been processed!";
      result.data = data;
    })
    .catch((error) => {
      result.returnCode = -1;
      result.returnMessage = "Something went wrong!, try again.";
      result.serverError = error;
    })
    .finally(() => response.json(result));
});

router.get("/getlayouttexts/:uppertext/:lowertext", function (
  request,
  response
) {
  let result = {
    data: null,
    returnCode: 0,
    returnMessage: "Request not processed.",
    serverError: null,
  };
  HomeTexts.findAll({
    where: { IsActive: true, [Op.or]: [{ TypeId: 1 }, { TypeId: 2 }] },
    attributes: [
      "TypeId",
      [request.params.uppertext, "UpperText"],
      [request.params.lowertext, "LowerText"],
    ],
    order: [["TypeId", "ASC"]],
  })
    .then((data) => {
      result.returnCode = 1;
      result.returnMessage = "English texts has been processed!";
      result.data = data;
    })
    .catch((error) => {
      result.returnCode = -1;
      result.returnMessage = "Something went wrong!, try again.";
      result.serverError = error;
    })
    .finally(() => response.json(result));
});


router.post("/create", function (request, response) {
  let result = {
    data: null,
    returnCode: 0,
    returnMessage: "Request not processed.",
    serverError: null,
  };
  HomeTexts.create(request.body)
    .then(() => {
      result.returnCode = 1;
      result.returnMessage = "Slider has been added!";
      getAllHomeTexts().then((data) => {
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

  HomeTexts.update({ IsActive: false }, { where: { Id: request.params.id } })
    .then(() => {
      result.returnCode = 1;
      result.returnMessage = "Home Texts has been updated!";
      getAllSliders().then((homeTextsList) => {
        result.data = homeTextsList.data;
        response.json(result);
      });
    })
    .catch(() => {
      result.returnCode = -1;
      result.returnMessage = "Home Text wasn't updated. Try again, please.";
      response.json(result);
    });
});

router.put("/update/:id", function (request, response) {
  let result = {
    data: null,
    returnCode: 0,
    returnMessage: "Request not processed.",
  };

  HomeTexts.update(
    {
      UpperTextEnglish: request.body.UpperTextEnglish,
      LowerTextEnglish: request.body.LowerTextEnglish,
      UpperTextFrench: request.body.UpperTextFrench,
      LowerTextFrench: request.body.LowerTextFrench,
    },
    { where: { Id: request.params.id } }
  )
    .then(() => {
      result.returnCode = 1;
      result.returnMessage = "Home Texts has been updated!";
      getAllHomeTexts().then((homeTextsList) => {
        result.data = homeTextsList.data;
        response.json(result);
      });
    })
    .catch(() => {
      result.returnCode = -1;
      result.returnMessage = "Home Texts wasn't updated. Try again, please.";
      response.json(result);
    });
});

module.exports = router;
