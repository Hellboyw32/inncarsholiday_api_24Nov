var express = require("express");
const { Banners } = require("../config/database");
var router = express.Router();
const Op = require("sequelize").Op;

async function getAllBanners() {
  let result = {};
  await Banners.findAll({ where: { IsActive: true } })
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
    });
  return result;
}

router.get("/", function (request, response) {
  getAllBanners().then((data) => {
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
  Banners.create(request.body)
    .then(() => {
      result.returnCode = 1;
      result.returnMessage = "Banner added successfully!";
      getAllBanners().then((data) => {
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

  Banners.update({ IsActive: false }, { where: { Id: request.params.id } })
    .then(() => {
      result.returnCode = 1;
      result.returnMessage = "Banner deleted successfully!";
      getAllBanners().then((bannerList) => {
        result.data = bannerList.data;
        response.json(result);
      });
    })
    .catch(() => {
      result.returnCode = -1;
      result.returnMessage = "Banners wasn't updated. Try again, please.";
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
  Banners.update(
    {
      ImagePath: request.body.ImagePath,
    },
    { where: { Id: request.params.id } }
  )
    .then(() => {
      result.returnCode = 1;
      result.returnMessage = "Banner updated successfully!";
      getAllBanners().then((bannerList) => {
        result.data = bannerList.data;
        response.json(result);
      });
    })
    .catch(() => {
      result.returnCode = -1;
      result.returnMessage = "Banner wasn't updated. Try again, please.";
      response.json(result);
    });
});

router.get("/homepagebanners", function (request, response) {
  let result = {
    data: null,
    returnCode: 0,
    returnMessage: "Request not processed.",
  };
  Banners.findAll({ where: { IsActive: true, PositionId: { [Op.lt]: 7 } }, order: [['PositionId', 'ASC']] })
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

router.get("/carlistingbanners", function (request, response) {
  let result = {
    data: null,
    returnCode: 0,
    returnMessage: "Request not processed.",
  };
  Banners.findAll({ where: { IsActive: true, PositionId: { [Op.gte]: 7 } }, order: [['PositionId', 'ASC']] })
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

router.get("/cardetailpagebanners", function (request, response) {
  let result = {
    data: null,
    returnCode: 0,
    returnMessage: "Request not processed.",
  };
  Banners.findAll({ where: { IsActive: true, PositionId: { [Op.lt]: 3 } }, order: [['PositionId', 'ASC']] })
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
