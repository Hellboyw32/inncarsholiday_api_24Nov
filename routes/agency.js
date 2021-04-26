var express = require("express");
const { Agency, City } = require("../config/database");
var router = express.Router();
const Op = require("sequelize").Op;

async function getAllAgencies(page, pageSize, search, status = 0) {

  let limit = pageSize;
  let offset = (page - 1) * pageSize;
  let result = {};
  let requestParams = {
    limit,
    offset,
    where: { IsActive: true },
    order: [["Id", "DESC"]],
    include: [{ model: City }]
  };

  if (search && search != "" && search != "empty") {
    requestParams.where = {
      [Op.or]: [
        { Email: { [Op.like]: search + "%" } },
        { Name: { [Op.like]: search + "%" } },
      ],
    };
  }

  if (status && status == "all")
    delete requestParams.where["IsActive"]

  await Agency.findAndCountAll(requestParams)
    .then((data) => {
      result.returnCode = 1;
      if (data) {
        result.data = data.rows;
        result.count = data.count;
        result.returnMessage = "Agency successfully loaded!";
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

router.get("/", (request, response) => {
  let result = {
    data: null,
    returnCode: 0,
    returnMessage: "Request not processed.",
  };
  Agency.findAll({ where: { IsActive: true } })
    .then((data) => {
      result.returnCode = 1;
      if (data) {
        result.data = data;
        result.returnMessage = "Agency successfully loaded!";
      } else {
        result.returnMessage = "No Agencies found!";
      }
    })
    .catch((error) => {
      console.log(error);
      result.returnCode = -1;
      result.returnMessage = "Server error occured!";
    })
    .finally(() => response.json(result));
});

router.get("/:page/:pageSize/:search/:status?", function (request, response) {
  getAllAgencies(+request.params.page, +request.params.pageSize, request.params.search, request.params.status).then((data) => {
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
  Agency.create(request.body)
    .then(() => {
      result.returnCode = 1;
      result.returnMessage = "Agency added successfully!";
      getAllAgencies(1, 10, "empty", "all").then((data) => {
        result.data = data.data;
        result.count = data.count;
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
    count: 0,
    returnMessage: "Request not processed.",
  };

  Agency.update({ IsActive: false }, { where: { Id: request.params.id } })
    .then(() => {
      result.returnCode = 1;
      result.returnMessage = "Agency deleted successfully!";
      getAllAgencies(1, 10, "empty", "all").then((agencyList) => {
        result.data = agencyList.data;
        result.count = agencyList.count;
        response.json(result);
      });
    })
    .catch((error) => {
      console.log(error);
      result.returnCode = -1;
      result.returnMessage = "Banners wasn't updated. Try again, please.";
      response.json(result);
    });
});

router.patch("/restore/:id", function (request, response) {
  let result = {
    data: null,
    returnCode: 0,
    count: 0,
    returnMessage: "Request not processed.",
  };

  Agency.update({ IsActive: true }, { where: { Id: request.params.id } })
    .then(() => {
      result.returnCode = 1;
      result.returnMessage = "Agency restored successfully!";
      getAllAgencies(1, 10, "empty", "all").then((agencyList) => {
        result.data = agencyList.data;
        result.count = agencyList.count;
        response.json(result);
      });
    })
    .catch((error) => {
      console.log(error);
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
  Agency.update(
    {
      Email: request.body.Email,
      Name: request.body.Name,
      LogoPath: request.body.LogoPath,
      CityId: request.body.CityId,
      Description: request.body.Description,
      Abbreviation: request.body.Abbreviation,
    },
    { where: { Id: request.params.id } }
  )
    .then(() => {
      result.returnCode = 1;
      result.returnMessage = "Agency updated successfully!";
      getAllAgencies(1, 10, "empty", "all").then((agencyList) => {
        result.data = agencyList.data;
        result.count = agencyList.count;
        response.json(result);
      });
    })
    .catch((error) => {
      console.log(error);
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



module.exports = router;
