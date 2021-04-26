var express = require("express");

const { TransmissionTypes } = require("../config/database");
var router = express.Router();
const Op = require("sequelize").Op;

//All TransmissionTypes
router.get("/", function (request, response) {
    debugger
    var result = { returnCode: 0, data: null, returnMessage: "" };
    TransmissionTypes.findAll({ order: [['Name', 'ASC']] }).then(transmissions => {
        result.data = transmissions;
        result.returnMessage = "Success";
        response.json(result);
        return;
    }).catch(error => {
        result.returnCode = -1;
        result.returnMessage = "Server Error";
        response.json(result);
        return;
    });
});

//All TransmissionTypes
router.get("/paging/all", function (request, response) {
    debugger
    var pageSize = request.query.page_size;
    var page = request.query.page;
    var result = { returnCode: 0, count: 0, data: null, returnMessage: "" };
    search = {
        whare: { IsActive: true },
        order: []
    }
    if (request.query.search) {
        search.where = {
            Name: { [Op.like]: request.query.search + "%" },
        }
    }
    else {

        search.order.push(['CreatedOn', 'DESC']);
    }

    TransmissionTypes.findAndCountAll(search).then(TransmissionTypes => {
        debugger
        result.count = TransmissionTypes.count;
        result.data = TransmissionTypes.rows.slice((page - 1) * pageSize, page * pageSize);
        result.returnCode = 0;
        result.returnMessage = "Success";
        response.json(result);
        return;
    }).catch(error => {
        debugger
        result.returnCode = -1;
        result.returnMessage = "Server Error";
        response.json(result);
        return;
    });
});

//Get By Id
router.get("/:id", function (request, response) {
    debugger
    debugger
    var result = { returnCode: 0, data: null, returnMessage: "" };
    TransmissionTypes.findByPk(request.params.id).then(data => {
        if (data != null) {
            result.returnMessage = "success";
            result.returnCode = 1;
            result.data = data;
            response.json(result);
        }
        else {
            result.returnMessage = "user not find";
            response.json(result);
        }

    }).catch(err => {
        result.returnMessage = "server error";
        result.returnCode = -1;
        response.json(result);
    })
})

//create
router.post("/create", function (request, response) {
    debugger
    var result = { returnCode: 0, data: null, returnMessage: "" };
    TransmissionTypes.create(request.body).then(TransmissionTypes => {
        result.data = TransmissionTypes;
        result.returnMessage = "Success";
        response.json(result);
    }).catch(err => {
        result.returnCode = -1;
        result.returnMessage = "Server Error";
        response.json(result);
    })
});

//update 
router.post("/update/:id", function (request, response) {
    debugger
    var result = { returnCode: 0, data: null, returnMessage: "" };
    TransmissionTypes.findByPk(request.params.id).then(TransmissionTypes => {
        if (TransmissionTypes != null) {
            TransmissionTypes.Name = request.body.Name;
            TransmissionTypes.IsActive = true;
            TransmissionTypes.save();
            result.data = TransmissionTypes;
            result.returnMessage = "Success"
        }
        else {
            result.returnCode = -1;
            result.returnMessage = "TransmissionTypes is Not Found"
        }
        response.json(result);
    }).catch(err => {
        response.send(err);
    });
});

//delete
router.post("/delete/:id", function (request, response) {
    debugger
    var result = { returnCode: 0, data: null, returnMessage: "" };
    TransmissionTypes.findByPk(request.params.id).then(TransmissionTypes => {
        TransmissionTypes.IsActive = false;
        TransmissionTypes.save();
        result.returnCode = 1;
        result.returnMessage = "Deleted";
    }).catch(err => {
        result.returnCode = -1;
        result.returnMessage = "server error";
    })

})


module.exports = router;

