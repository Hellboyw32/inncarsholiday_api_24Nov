var express = require("express");
const { HomeBanner, Locality } = require("../config/database");
var router = express.Router();

async function getAllHomeBanners(positionId = 0) {
  let result = {};
  let queryParams = {
    where: { IsActive: true },
    include: [{ model: Locality, required: true }],
  };
  if (positionId && positionId != 0)
    queryParams.where.PositionId = positionId;
  await HomeBanner.findAll(queryParams)
    .then((data) => {
      result.returnCode = 1;
      if (data && data.length > 0) {
        result.data = data;
        result.returnMessage = "Home Banners successfully loaded!";
      } else {
        result.returnMessage = "No Banners found!";
      }
    })
    .catch((error) => {
      console.log(error);
      result.returnCode = -1;
      result.returnMessage = "Server error occured!";
    });
  return result;
}

router.get("/:positionId?", function (request, response) {
  getAllHomeBanners(+request.params.positionId).then((data) => {
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
  HomeBanner.create(request.body)
    .then((saveRes) => {
      result.returnCode = 1;
      result.returnMessage = "Home Banner added successfully!";
      getAllHomeBanners(+request.body.PositionId).then((data) => {
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
      result.returnMessage = "Home Banner deleted successfully!";
      getAllHomeBanners(+request.params.positionId).then((homeBannerList) => {
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

router.put("/update/:id", function (request, response) {
  let result = {
    data: null,
    returnCode: 0,
    returnMessage: "Request not processed.",
  };
  // Position: request.body.Position,
  HomeBanner.update(
    {
      ImagePath: request.body.ImagePath,
      LocationId: request.body.LocationId,
      From: request.body.From,
      To: request.body.To,
      Price: request.body.Price,  
    },
    { where: { Id: request.params.id } }
  )
    .then((resSave) => {
      console.log("POSITION ID",resSave.PositionId)
      result.returnCode = 1;
      result.returnMessage = "Home Banner updated successfully!";
      getAllHomeBanners(request.body.PositionId).then((bannerList) => {
        result.data = bannerList.data;
        response.json(result);
      });
    })
    .catch((error) => {
      console.log(error)
      result.returnCode = -1;
      result.returnMessage = "Banner wasn't updated. Try again, please.";
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
