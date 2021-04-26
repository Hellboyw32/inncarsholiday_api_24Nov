var express = require("express");
const { sequelize, LocalityFaq} = require("../config/database");
const Op = require("sequelize").Op;
var router = express.Router();


router.get("/:Id", function (req, res) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  console.log("single record",req.params.Id)
  LocalityFaq.findOne({
    where: { Id: req.params.Id }
  })
    .then((data) => {
      result.returnCode = 0;
      result.returnMessage = "Success";
      result.data = data;
      res.json(result);
    })
    .catch((error) => {
      console.log("single record",error)
      result.returnCode = -1;
      result.returnMessage = error;
      res.json(result);
    });
});


router.get("/getFaqByLocality/:localityId?", function (req, res) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  
  LocalityFaq.findAll({
    where: { LocalityId: req.params.localityId,Status: 'active' }
  })
    .then((data) => {
      result.returnCode = 0;
      result.returnMessage = "Success";
      result.data = data;
      res.json(result);
    })
    .catch((error) => {
      result.returnCode = -1;
      result.returnMessage = error;
      res.json(result);
    });
});

router.post("/create", (req, res) => {
    var result = { returnCode: 0, data: null, returnMessage: "" };
    
      LocalityFaq.create(req.body)
      .then(() => {
        result.returnCode = 0;
          result.data = {};
          result.returnMessage = "Faq has been added";
          return res.json(result);
        })
      .catch((error) => {
        console.log("locality faq",error);
        result.returnCode = -1;
        result.returnMessage = "Something went wrong!, try again.";
        result.serverError = "";
        res.json(result);
      });
    })
  




router.post("/update/:Id", (req, res) => {
  var result = { returnCode: 0, data: null, returnMessage: "" };
    LocalityFaq.update(
      {
        Question: req.body.Question,
        Answer: req.body.Answer,
        LocalityId: req.body.LocalityId
      },
      { where: { Id: req.params.Id } }
    )
      .then(() => {
        result.returnCode = 0;
        result.returnMessage = "Faq has been updated!";
        res.json(result);
      })
      .catch(() => {
        result.returnCode = -1;
        result.returnMessage = "Faq wasn't updated. Try again, please.";
        res.json(result);
      });
 
  })

  router.post("/delete/:Id", (req, res) => {
    var result = { returnCode: 0, data: null, returnMessage: "" };
      LocalityFaq.update(
        {
          Status: req.body.Status
        },
        { where: { Id: req.params.Id } }
      )
        .then(() => {
          result.returnCode = 0;
          result.returnMessage = "Faq has been deleted!";
          res.json(result);
        })
        .catch(() => {
          result.returnCode = -1;
          result.returnMessage = "Faq wasn't deleted. Try again, please.";
          res.json(result);
        });
   
    })



module.exports = router;
