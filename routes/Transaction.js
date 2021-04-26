var express = require("express");
const {
    Transaction,
    CarRental
} = require("../config/database");
var router = express.Router();
const Op = require("sequelize").Op;

//All Transactions
router.get("/", function (request, response) {
    debugger
    var result = { returnCode: 0, data: null, returnMessage: "" };
    Transaction.findAll().then(transactions => {
        result.data = transactions;
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

//All Transactions
router.get("/paging/all", function (request, response) {
    debugger
    var pageSize = request.query.page_size;
    var page = request.query.page;
    var result = { returnCode: 0, count: 0, data: null, returnMessage: "" };
    search = {
        whare: {},
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

    Transaction.findAndCountAll(search).then(transactions => {
        debugger
        result.count = transactions.count;
        result.data = transactions.rows.slice((page - 1) * pageSize, page * pageSize);
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

router.get('/transactions', (request, response) => {
    var result = { returnCode: 0, data: null, returnMessage: "" };
    Transaction.findAll({
        where: {
            Id: request.query.transactions.split(",")
        },

    }).then(data => {
        result.data = data;
        response.json(result);
    }).catch(err => {

    });
});
// Get transaction By Id
router.get('/:id', function (request, response) {
    debugger
    var result = { returnCode: 0, data: null, returnMessage: "" };
    Transaction.findByPk(request.params.id).then(data => {
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

});


// Add transaction
router.post("/create", function (request, response) {
    debugger
    var result = { returnCode: 0, data: null, returnMessage: "" };
    Transaction.create(request.body).then(transaction => {
        result.data = transaction;
        result.returnMessage = "Success";
        response.json(result)
    }).catch(err => {
        result.returnCode = -1;
        result.returnMessage = "Server Error";
        response.json(result);
    })
});


router.post("/update/:id", function (request, response) {

    var result = { returnCode: 0, data: null, returnMessage: "" };
    Transaction.findByPk(request.params.id).then(transactions => {
        if (transactions != null) {
            transactions.Name = request.body.Name;
            transactions.TransactionCode = request.body.TransactionCode;
            transactions.save();
            result.data = transactions;
            result.returnMessage = "Success"
        }
        else {
            result.returnCode = -1;
            result.returnMessage = "Transaction not found"
        }
        response.json(result);
    }).catch(err => {
        response.send(err);
    });
});

router.post("/delete/:id", function (request, response) {

    var result = { returnCode: 0, data: null, returnMessage: "" };
    Transaction.destroy({ where: { Id: request.params.id } }).then(transaction => {
        result.data = true;
        result.returnMessage = "Success";
        response.json(result);
    }).catch(err => {
        result.returnCode = -1;
        result.returnMessage = "Server Error";
        response.json(result);
    })
});





module.exports = router;
