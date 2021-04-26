var express = require("express");
const { LocationTypeMeta } = require("../config/database");
var router = express.Router();

async function getAllLocationMetaType(locationmetatypeId = 0) {
  let result = {};
  let queryParams = { where: { IsActive: true } };
  if (locationmetatypeId && locationmetatypeId != 0)
    queryParams.where.Id = locationmetatypeId;
  await LocationTypeMeta.findAll(queryParams)
    .then((data) => {
      result.returnCode = 1;
      if (data && data.length > 0) {
        result.data = data;
        result.returnMessage = "Location Type Meta successfully loaded!";
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

router.get("/:locationmetatypeId?", function (request, response) {
    getAllLocationMetaType(+request.params.locationmetatypeId).then((data) => {
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
  LocationTypeMeta.create(request.body)
    .then((saveRes) => {
      result.returnCode = 1;
      result.returnMessage = "Location Type Meta has been added!";
      getAllLocationMetaType().then((data) => {
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

router.delete("/delete/:id/:positionId", function (request, response) {
  let result = {
    data: null,
    returnCode: 0,
    returnMessage: "Request not processed.",
  };

  HomeBanner.update({ IsActive: false }, { where: { Id: request.params.id } })
    .then(() => {
      result.returnCode = 1;
      result.returnMessage = "Home Banner has been updated!";
      getAllHomeBanners(+request.body.PositionId).then((homeBannerList) => {
        result.data = homeBannerList.data;
        response.json(result);
      });
    })
    .catch(() => {
      result.returnCode = -1;
      result.returnMessage = "Home Banner wasn't updated. Try again, please.";
      response.json(result);
    });
});

router.put("/update", function (request, response) {
  let result = {
    data: null,
    returnCode: 0,
    returnMessage: "Request not processed.",
  };
  LocationTypeMeta.update(
    {
      TypeId: request.body.TypeId,
      ServiceLabel: request.body.ServiceLabel,
      ServiceDescription: request.body.ServiceDescription,
      TimingLabel: request.body.TimingLabel,
      TimingDescription: request.body.TimingDescription,
      Instructions: request.body.Instructions,
      ServiceLabelFrench: request.body.ServiceLabelFrench,
      ServiceDescriptionFrench: request.body.ServiceDescriptionFrench,
      TimingLabelFrench: request.body.TimingLabelFrench,
      TimingDescriptionFrench: request.body.TimingDescriptionFrench,
      InstructionsFrench: request.body.InstructionsFrench,
    },
    { where: { Id: request.body.Id } }
  )
    .then(() => {
      result.returnCode = 1;
      result.returnMessage = "Location Type Meta has been updated!";
      getAllLocationMetaType().then((locationMetaList) => {
        result.data = locationMetaList.data;
        response.json(result);
      });
    })
    .catch((error) => {
      console.log(error);
      result.returnCode = -1;
      result.returnMessage = "Location Type Meta wasn't updated. Try again, please.";
      response.json(result);
    });
});

router.get("/getbybannerlocation/:bannerlocationId", function (
  request,
  response
) {
  let result = {
    data: null,
    returnCode: 0,
    returnMessage: "Request not processed.",
  };
  HomeBanner.findAll({
    where: {
      IsActive: true,
      BannerLocationId: +request.params.bannerlocationId,
    },
    order: [["PositionId", "ASC"]],
  })
    .then((data) => {
      result.returnCode = 1;
      if (data && data.length > 0) {
        result.data = data;
        result.returnMessage = "Banners successfully loaded!";
      } else {
        result.returnMessage = "No Banners found!";
      }
    })
    .catch((error) => {
      console.log(error);
      result.returnCode = -1;
      result.returnMessage = "Server error occured!";
    })
    .finally(() => response.json(result));
});

module.exports = router;
