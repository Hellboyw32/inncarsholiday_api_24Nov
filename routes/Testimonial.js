var express = require("express");
const { Testimonial } = require("../config/database");
var router = express.Router();
const Op = require("sequelize").Op;

async function getAllTestimonials(email = 0, approve = 0, limit = 0) {
  let result = {};

  let queryParams = { where: { IsActive: true } };

  if (email && email != "" && email != "null") queryParams.where.Email = email;

  if (approve && approve != "" && approve != "null") {
    if (approve == "true") queryParams.where.IsApproved = true;
    else queryParams.where.IsApproved = false;
  }

  if (limit && limit != "" && limit != "null") queryParams.limit = +limit;

  await Testimonial.findAll(queryParams)
    .then((data) => {
      result.returnCode = 1;
      if (data && data.length > 0) {
        result.data = data;
        result.returnMessage = "Testimonial successfully loaded!";
      } else {
        result.returnMessage = "No Testimonial found!";
      }
    })
    .catch((error) => {
      console.log(error);
      result.returnCode = -1;
      result.returnMessage = "Server error occured!";
    });
  return result;
}

router.get("/:email?/:approve?/:limit?", function (request, response) {
  getAllTestimonials(request.params.email, request.params.approve, request.params.limit).then((data) => {
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
  Testimonial.create(request.body)
    .then((data) => {
      result.returnCode = 1;
      result.returnMessage = "Testimonial added successfully!";
      result.data = data;
      response.json(result);
      // getAllTestimonials().then((data) => {
      //   result.data = data.data;
      //   response.json(result);
      // });
    })
    .catch((error) => {
      console.log(error);
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

  Testimonial.update({ IsActive: false }, { where: { Id: request.params.id } })
    .then(() => {
      result.returnCode = 1;
      result.returnMessage = "Testimonial deleted successfully!";
      getAllTestimonials().then((testimonialList) => {
        result.data = testimonialList.data;
        response.json(result);
      });
    })
    .catch(() => {
      result.returnCode = -1;
      result.returnMessage = "Testimonial wasn't updated. Try again, please.";
      response.json(result);
    });
});

router.put("/update/:id", function (request, response) {
  let result = {
    data: null,
    returnCode: 0,
    returnMessage: "Request not processed.",
  };
  Testimonial.update(
    {
      Rating: request.body.Rating,
      Description: request.body.Description,
    },
    { where: { Id: request.params.id } }
  )
    .then(() => {
      result.returnCode = 1;
      result.returnMessage = "Testimonial updated successfully!";
      getAllTestimonials(request.body.email).then((testimonialList) => {
        result.data = testimonialList.data;
        response.json(result);
      });
    })
    .catch(() => {
      result.returnCode = -1;
      result.returnMessage = "Testimonial wasn't updated. Try again, please.";
      response.json(result);
    });
});

  router.patch("/update/:id", function (request, response) {
    let result = {
      data: null,
      returnCode: 0,
      returnMessage: "Request not processed.",
    };
    Testimonial.update(
      {
        IsApproved: request.body.IsApproved,
      },
      { where: { Id: request.params.id } }
    )
      .then(() => {
        result.returnCode = 1;
        result.returnMessage = "Testimonial updated successfully!";
        getAllTestimonials().then((testimonialList) => {
          result.data = testimonialList.data;
          response.json(result);
        });
      })
      .catch(() => {
        result.returnCode = -1;
        result.returnMessage = "Testimonial wasn't updated. Try again, please.";
        response.json(result);
      });
  });

module.exports = router;
