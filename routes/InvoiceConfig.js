var express = require("express");
const { InvoiceConfig } = require("../config/database");
var router = express.Router();

async function getAllInvoiceConfig(configId = 0) {
  let result = {
    data: null,
    returnCode: 0,
    returnMessage: "Request not processed.",
  };
  if (!configId || configId == 0)
    await InvoiceConfig.findAll()
      .then((data) => {
        result.returnCode = 1;
        if (data) {
          result.data = data;
          result.returnMessage = "Invoice Config successfully loaded!";
        } else {
          result.returnMessage = "No Invoice Config found!";
        }
      })
      .catch((error) => {
        console.log(error);
        result.returnCode = -1;
        result.returnMessage = "Server error occured!";
      });
  else {
    await InvoiceConfig.findOne({ where: { Id: configId } })
      .then((data) => {
        result.returnCode = 1;
        if (data) {
          result.data = data;
          result.returnMessage = "Invoice Config successfully loaded!";
        } else {
          result.returnMessage = "No Invoice Config found!";
        }
      })
      .catch((error) => {
        console.log(error);
        result.returnCode = -1;
        result.returnMessage = "Server error occured!";
      });
  }
  return result;
}

router.get("/:id?", (request, response) => {
  getAllInvoiceConfig(+request.params.id).then((res) => {
    response.json(res);
  });
});

router.post("/", function (request, response) {
  let result = {
    data: null,
    returnCode: 0,
    returnMessage: "Request not processed.",
    serverError: null,
  };
  InvoiceConfig.create(request.body)
    .then(() => {
      result.returnCode = 1;
      result.returnMessage = "Invoice Config added successfully!";
      getAllInvoiceConfig().then((data) => {
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

router.put("/:id", function (request, response) {
  let result = {
    data: null,
    returnCode: 0,
    returnMessage: "Request not processed.",
  };
  InvoiceConfig.update(
    {
        Text: request.body.Text,
    },
    { where: { Id: request.params.id } }
  )
    .then(() => {
      result.returnCode = 1;
      result.returnMessage = "Invoice Config updated successfully!";
      getAllInvoiceConfig().then((invoiceConfigList) => {
        result.data = invoiceConfigList.data;
        result.count = invoiceConfigList.count;
        response.json(result);
      });
    })
    .catch(() => {
      result.returnCode = -1;
      result.returnMessage = "Invoice Config wasn't updated. Try again, please.";
      response.json(result);
    });
});

module.exports = router;
