var express = require("express");
const { MainBanner } = require("../config/database");
var router = express.Router();
const Op = require("sequelize").Op;

async function getMainBannerDetails(selectedLanguage = 0) {
  //console.log("selectedLanguage", selectedLanguage);
  let result = {};
  let queryparams = { where: { IsActive: true } };
  if (selectedLanguage && selectedLanguage != 0) {
    //console.log("selectedLanguage", selectedLanguage);
    if (selectedLanguage == "english")
      queryparams.attributes = [
        "ImagePath",
        "Heading",
        "Description",
        "ButtonText",
      ];
    else
      queryparams.attributes = [
        "ImagePath",
        ["HeadingFr", "Heading"],
        ["DescriptionFr", "Description"],
        ["ButtonTextFr", "ButtonText"],
      ];
  }
  await MainBanner.findAll(queryparams)
    .then((data) => {
      result.returnCode = 1;
      if (data && data.length > 0) {
        result.data = data;
        result.returnMessage = "Main Banner successfully loaded!";
      } else {
        result.returnMessage = "No Main Banner details found!";
      }
    })
    .catch((error) => {
      result.returnCode = -1;
      result.returnMessage = "Server error occured!";
    });
  return result;
}

router.get("/:selectedLanguage?", function (request, response) {
  //console.log("selectedLanguage", request.params.selectedLanguage);
    getMainBannerDetails(request.params.selectedLanguage).then((data) => {
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
  MainBanner.create(request.body)
    .then(() => {
      result.returnCode = 1;
      result.returnMessage = "Main Banner added successfully!";
      getMainBannerDetails().then((data) => {
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

  MainBanner.update({ IsActive: false }, { where: { Id: request.params.id } })
    .then(() => {
      result.returnCode = 1;
      result.returnMessage = "Main Banner deleted successfully!";
      getMainBannerDetails().then((bannerDetails) => {
        result.data = bannerDetails.data;
        response.json(result);
      });
    })
    .catch(() => {
      result.returnCode = -1;
      result.returnMessage = "Main Banner detail wasn't updated. Try again, please.";
      response.json(result);
    });
});

router.put("/update/:id", function (request, response) {
  let result = {
    data: null,
    returnCode: 0,
    returnMessage: "Request not processed.",
  };

  MainBanner.update(
    {
      ImagePath: request.body.ImagePath,
      Heading: request.body.Heading,
      Description: request.body.Description,
      ButtonText: request.body.ButtonText,
      HeadingFr: request.body.HeadingFr,
      DescriptionFr: request.body.DescriptionFr,
      ButtonTextFr: request.body.ButtonTextFr
    },
    { where: { Id: request.params.id } }
  )
    .then(() => {
      result.returnCode = 1;
      result.returnMessage = "Main Banner updated successfully!";
      getMainBannerDetails().then((bannerDetails) => {
        result.data = bannerDetails.data;
        response.json(result);
      });
    })
    .catch(() => {
      result.returnCode = -1;
      result.returnMessage = "Banner detail wasn't updated. Try again, please.";
      response.json(result);
    });
});

module.exports = router;
