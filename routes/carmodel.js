var express = require("express");
const { CarModel, CarMake, CarRegistration } = require("../config/database");
var router = express.Router();
const Op = require("sequelize").Op;

//All Countries
router.get("/", function (request, response) {
  
  var result = { returnCode: 0, data: null, returnMessage: "" };
  CarModel.findAll({ order: [["Name", "ASC"]], where: { IsActive: true }})
    .then((res) => {
      result.data = res;
      result.returnMessage = "Success";
      response.json(result);
      return;
    })
    .catch((error) => {
      result.returnCode = -1;
      result.returnMessage = "Server Error";
      response.json(result);
      return;
    });
});

//All CarModel By pagind
router.get("/paging/all", function (request, response) {
  let options = {
    where: { IsActive: true },
    include: [{ model: CarMake }],
    order: [["CreatedOn", "DESC"]],
  };
  var pageSize = request.query.page_size;
  var page = request.query.page;
  var search = request.query.search;
  if (search && search != "")
    options.where = { IsActive: true, Name: { [Op.like]: search + "%" } };
  var result = { returnCode: 0, count: 0, data: null, returnMessage: "" };

  CarModel.findAndCountAll(options)
    .then((res) => {
      result.count = res.rows.length;
      result.data = res.rows.slice((page - 1) * pageSize, page * pageSize);
      result.returnCode = 0;
      result.returnMessage = "Success";
      response.json(result);
    })
    .catch((error) => {
      
      result.returnCode = -1;
      result.returnMessage = "Server Error";
      response.json(result);
      return;
    });
});

router.get("/pagingsearch/all", function (request, response) {
  const offset =
    parseInt(request.query.page - 1) * parseInt(request.query.page_size);
  const limit = parseInt(request.query.page_size);

  var result = { returnCode: 0, count: 0, data: null, returnMessage: "" };
  search = {
    limit,
    offset,
    where: { IsActive: true },
    include: [{ model: CarMake }],
    order: [],
  };
  count = {
    where: { IsActive: true },
    include: [{ model: CarMake }],
    order: [],
  };
  if (request.query.search) {
    search.where = {
      PageName: { [Op.like]: request.query.search + "%" },
    };
    count.where = {
      PageName: { [Op.like]: request.query.search + "%" },
    };
  } else {
    search.order.push(["Id", "DESC"]);
  }

  CarModel.findAll(search)
    .then((res) => {
      result.data = res;
      result.returnCode = 0;
      result.returnMessage = "Success";
    })
    .catch((error) => {
      result.returnCode = -1;
      result.returnMessage = "Server Error";
      response.json(result);
      return;
    });
});

// Get Carmodel  By Id
router.get("/:id", function (request, response) {
  
  var result = { returnCode: 0, data: null, returnMessage: "" };
  CarModel.findByPk(request.params.id)
    .then((data) => {
      if (data != null) {
        result.returnMessage = "success";
        result.returnCode = 1;
        result.data = data;
        response.json(result);
      } else {
        result.returnMessage = "user not find";
        response.json(result);
      }
    })
    .catch((err) => {
      result.returnMessage = "server error";
      result.returnCode = -1;
      response.json(result);
    });
});

// Add Car Model
router.post("/create", function (request, response) {
  

  var result = { returnCode: 0, data: null, returnMessage: "" };
  CarModel.create(request.body)
    .then((res) => {
      result.data = res;
      result.returnMessage = "Success";
      response.json(result);
    })
    .catch((err) => {
      result.returnCode = -1;
      result.returnMessage = "Server Error";
      response.json(result);
    });
});

router.post("/update/:id", function (request, response) {
  
  var result = { returnCode: 0, data: null, returnMessage: "" };
  CarModel.findByPk(request.params.id)
    .then((res) => {
      if (res != null) {
        res.Name = request.body.Name;
        res.CarMakeId = request.body.CarMakeId;
        res.Capacity = request.body.Capacity;
        res.Doors = request.body.Doors;
        res.TransmissionTypeId = request.body.TransmissionTypeId;
        res.BigPieceLuggage = request.body.BigPieceLuggage;
        res.SmallPieceLuggage = request.body.SmallPieceLuggage;
        res.IsActive = true;
        res.CreatedOn = request.body.CreatedOn;
        res.UpdatedOn = request.body.UpdatedOn;
        res.save().then(
          (resSave) => {
            result.data = res;
            result.returnMessage = "Success";
          },
          (errSave) => {
            result.data = errSave;
            result.returnMessage = "Success";
          }
        );
      } else {
        result.returnCode = -1;
        result.returnMessage = "CarModel not found";
      }
      response.json(result);
    })
    .catch((err) => {
      response.send(err);
    });
});

router.post("/delete/:id", function (request, response) {
  
  var result = { returnCode: 0, data: null, returnMessage: "" };
  CarModel.destroy({ where: { Id: request.params.id } })
    .then((res) => {
      result.data = true;
      result.returnMessage = "Success";
      response.json(result);
    })
    .catch((err) => {
      result.returnCode = -1;
      result.returnMessage = "Server Error";
      response.json(result);
    });
});

router.post("/carmodelexist", function (request, response) {
  
  var result = { returnCode: 0, data: null, returnMessage: "" };
  CarModel.findOne({
    where: { Name: request.body.Name, Id: { [Op.ne]: request.body.Id } },
  })
    .then((res) => {
      if (res == null) {
        result.returnCode = 0;
        result.returnMessage = "CarModel not exists";
      } else {
        result.returnCode = -1;
        result.returnMessage = "CarModel already exist";
      }
      response.json(result);
    })
    .catch((err) => {
      result.returnCode = -1;
      result.returnMessage = "Server Error";
      response.json(result);
    });
});

//Filter Apis

router.get("/byDoors/withdoorno", function (request, response) {
  

  var pageSize = request.query.page_size;
  var page = request.query.page;
  var doors = request.query.doors;

  var result = { returnCode: 0, data: null, returnMessage: "" };
  var doors = request.query.doors;
  CarModel.findAndCountAll({
    where: { Doors: doors, IsActive: true },
    include: [{ model: CarRegistration }],
  })
    .then((res) => {
      if (res != null) {
        result.returnCode = 1;
        result.data = res.rows.slice((page - 1) * pageSize, page * pageSize);
        result.returnMessage = "success";
        response.json(result);
      }
    })
    .catch((err) => {
      response.send(err);
    });
});

router.get("/bysheat/withsheatno", function (request, response) {
  
  var pageSize = request.query.page_size;
  var page = request.query.page;
  var sheat = request.query.sheat;
  var result = { returnCode: 0, data: null, returnMessage: "" };
  CarModel.findAndCountAll({
    where: { Capacity: sheat, IsActive: true },
    include: [{ model: CarRegistration }],
  })
    .then((res) => {
      if (res != null) {
        result.data = res.rows.slice((page - 1) * pageSize, page * pageSize);
        result.returnMessage = "Successfull";
        result.returnCode = 1;
        response.json(result);
      }
    })
    .catch((err) => {
      response.send(err);
    });
});

router.get("/byComapny/WithCompanyId", function (request, response) {
  var pageSize = request.query.page_size;
  var page = request.query.page;
  var VenderId = request.query.sheat;

  CarRegistration.findAndCountAll({
    Where: { VenderId: VenderId, IsActive: true },
  })
    .then((res) => {
      if (res != null) {
        result.data = res.rows.slice((page - 1) * pageSize, page * pageSize);
        result.returnMessage = "Successfull";
        result.returnCode = 1;
        response.json(result);
      }
    })
    .catch((err) => {
      response.send(err);
    });
});

router.get("/bycarMake/withSelectedcarmakeId", function (request, response) {
  var pageSize = request.query.page_size;
  var page = request.query.page;
  var carmakeid = request.query.carmakeid;

  CarRegistration.findAndCountAll({ where: { CarTypeId: carmakeid } })
    .then((res) => {
      if (res != null) {
        result.data = res.rows.slice((page - 1) * pageSize, page * pageSize);
        result.returnMessage = "Successfull";
        result.returnCode = 1;
        response.json(result);
      }
    })
    .catch((res) => {
      response.send(res);
    });
});

module.exports = router;
