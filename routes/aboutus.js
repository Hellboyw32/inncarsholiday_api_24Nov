var express = require("express");
const { AboutUsPicture, AboutUsText } = require("../config/database");
var router = express.Router();
const Op = require("sequelize").Op;
//Below api is valid for both admin and user end
//when called without selected language => all fields include Id are returned
//else only fields relevant to rendering on front end with specific language are returned

async function getAllAboutUsTexts(selectedLanguage = 0) {
  let result = {};
  let queryparams = {
    where: { IsActive: true },
    order: [["PositionId", "ASC"]],
  };
  if (selectedLanguage && selectedLanguage != 0) {
    if (selectedLanguage == "english")
      queryparams.attributes = ["PositionId", ["EnglishText", "Text"]];
    else queryparams.attributes = ["PositionId", ["FrenchText", "Text"]];
  }
  await AboutUsText.findAll(queryparams)
    .then((data) => {
      result.returnCode = 1;
      if (data && data.length > 0) {
        result.data = data;
        result.returnMessage = "About texts have been loaded!";
      } else {
        result.returnMessage = "No Texts details found!";
      }
    })
    .catch((error) => {
      result.returnCode = -1;
      result.returnMessage = "Server error occured!";
    });
  return result;
}

async function getAllAboutUsPictures() {
  let result = {};
  let queryparams = { where: { IsActive: true } };
  await AboutUsPicture.findAll(queryparams)
    .then((data) => {
      result.returnCode = 1;
      if (data && data.length > 0) {
        result.data = data;
        result.returnMessage = "About us pictures successfully loaded!";
      } else {
        result.returnMessage = "No pictures found!";
      }
    })
    .catch((error) => {
      result.returnCode = -1;
      result.returnMessage = "Server error occured!";
    });
  return result;
}

router.get("/gettexts/:selectedLanguage?", function (request, response) {
  getAllAboutUsTexts(request.params.selectedLanguage).then((data) => {
    response.json(data);
  });
});

router.get("/getpictures/", function (request, response) {
  getAllAboutUsPictures(request.params.selectedLanguage).then((data) => {
    response.json(data);
  });
});

router.post("/createtext", function (request, response) {
  let result = {
    data: null,
    returnCode: 0,
    returnMessage: "Request not processed.",
    serverError: null,
  };
  AboutUsText.create(request.body)
    .then(() => {
      result.returnCode = 1;
      result.returnMessage = "Main Banner has been added!";
      getAllAboutUsTexts().then((data) => {
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

router.post("/createpicture", function (request, response) {
  let result = {
    data: null,
    returnCode: 0,
    returnMessage: "Request not processed.",
    serverError: null,
  };
  AboutUsPicture.create(request.body)
    .then(() => {
      result.returnCode = 1;
      result.returnMessage = "Main Banner has been added!";
      getAllAboutUsPictures().then((data) => {
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
router.put("/updatetext", function (request, response) {
  let result = {
    data: null,
    returnCode: 0,
    returnMessage: "Request not processed.",
  };

  AboutUsText.update(
    {
      EnglishText: request.body.EnglishText,
      FrenchText: request.body.FrenchText,
    },
    { where: { Id: request.body.Id } }
  )
    .then(() => {
      result.returnCode = 1;
      result.returnMessage = "Partner has been updated!";
      getAllAboutUsTexts().then((bannerDetails) => {
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

router.put("/updatepicture", function (request, response) {
  let result = {
    data: null,
    returnCode: 0,
    returnMessage: "Request not processed.",
  };

  AboutUsPicture.update(
    {
      LogoPath: request.body.LogoPath,
    },
    { where: { Id: request.body.Id } }
  )
    .then(() => {
      result.returnCode = 1;
      result.returnMessage = "Partner has been updated!";
      getAllAboutUsPictures().then((bannerDetails) => {
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

router.delete("/delete/:id", function (request, response) {
  let result = {
    data: null,
    returnCode: 0,
    returnMessage: "Request not processed.",
  };

  MainBanner.update({ IsActive: false }, { where: { Id: request.params.id } })
    .then(() => {
      result.returnCode = 1;
      result.returnMessage = "Main Banner has been updated!";
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
      ButtonTextFr: request.body.ButtonTextFr,
    },
    { where: { Id: request.params.id } }
  )
    .then(() => {
      result.returnCode = 1;
      result.returnMessage = "Partner has been updated!";
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
