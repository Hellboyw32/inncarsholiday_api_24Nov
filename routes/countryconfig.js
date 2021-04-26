var express = require("express");
const fs = require('fs');
const {
  sequelize,
  CountryConfig,
} = require("../config/database");
var router = express.Router();
const Sequelize = require("sequelize");
const Op = require("sequelize").Op;
const multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/flags/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now()
    cb(null, uniqueSuffix+"_"+file.originalname)
  }
})

const upload = multer({ storage: storage }).single('flag')

//const upload = multer({ dest: 'images/flags/' })
//const upload = multer({dest:'images/flags/'}).single("demo_image");



router.post("/getlist", (req, res) => {
    var result = { returnCode: 0, data: null, returnMessage: "" };
  //let buff = Buffer.from(req.params.Url, 'base64');
  //let text = buff.toString('ascii');
  //console.log("base64",text);
  CountryConfig.findAll()
    .then((data) => {
      if (data != null) {
        result.returnCode = 1;
        result.data = data;
        result.returnMessage = "Successfull";
        return res.json(result);
      }
    })
    .catch((err) => {
      console.log(err);
      result.returnCode = -1;
      result.returnMessage = "Server Error";
      return res.json(result);
    });
});


router.post("/findOne", (req, res) => {
    var result = { returnCode: 0, data: null, returnMessage: "" };
    //let buff = Buffer.from(req.params.Url, 'base64');
    //let text = buff.toString('ascii');
    //console.log("base64",text);
    CountryConfig.findOne({where: { country: req.body.country }})
      .then((data) => {
        if (data != null) {
          result.returnCode = 1;
          result.data = data;
          result.returnMessage = "Successfull";
          return res.json(result);
        }
      })
      .catch((err) => {
        console.log(err);
        result.returnCode = -1;
        result.returnMessage = "Server Error";
        return res.json(result);
      });
  });


  router.get("/findById/:id", (req, res) => {
    var result = { returnCode: 0, data: null, returnMessage: "" };
    //let buff = Buffer.from(req.params.Url, 'base64');
    //let text = buff.toString('ascii');
    //console.log("base64",text);
    CountryConfig.findOne({where: { id: req.params.id }})
      .then((data) => {
        if (data != null) {
          result.returnCode = 1;
          result.data = data;
          result.returnMessage = "Successfull";
          return res.json(result);
        }
      })
      .catch((err) => {
        console.log(err);
        result.returnCode = -1;
        result.returnMessage = "Server Error";
        return res.json(result);
      });
  });

  //delete location
router.post("/delete/:id", function (request, response) {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: "",
  };
  CountryConfig.findByPk(request.params.id)
    .then((data) => {
      if (data != null) {
        data.IsActive = false;
        data.save().then(() => {
          result.data = true;
          result.returnMessage = "Success";
          response.json(result);
        })
      }
    })
    .catch((err) => {
      result.returnCode = -1;
      result.returnMessage = "Server Error";
      response.json(result);
    });
});



router.post("/create", (req, res) => {
    var result = { returnCode: 0, data: null, returnMessage: "" };
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        result.returnCode = -1;
        result.returnMessage = "Something went wrong!, try again.";
        result.serverError = "";
        res.json(result);
      } else if (err) {
        // An unknown error occurred when uploading.
        result.returnCode = -1;
        result.returnMessage = "Something went wrong!, try again.";
        result.serverError = "";
        res.json(result);
      } else {
      //console.log("multer",req.file, req.body)
      //return res.json(result);
      req.body.flag = "images/flags/"+req.file.filename
      CountryConfig.create(req.body)
      .then(() => {
        result.returnCode = 0;
          result.data = {};
          result.returnMessage = "Country has been added";
          return res.json(result);
        })
      .catch((error) => {
        result.returnCode = -1;
        result.returnMessage = "Something went wrong!, try again.";
        result.serverError = "";
        res.json(result);
      });
    }
    })


  
  
});



router.post("/update", (req, res) => {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  upload(req, res, function (err) {
    //if(req.file){
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      result.returnCode = -1;
      result.returnMessage = "Something went wrong!, try again.";
      result.serverError = "";
      res.json(result);
    } else if (err) {
      // An unknown error occurred when uploading.
      result.returnCode = -1;
      result.returnMessage = "Something went wrong!, try again.";
      result.serverError = "";
      res.json(result);
    } else {
    console.log("multer",req.file, req.body)
    //return res.json(result);
    //req.body.flag = req.file ? "images/flags/"+req.file.filename : req.body.oldFlag;
    if(req.file){
      req.body.flag = "images/flags/"+req.file.filename;
      fs.unlink(req.body.oldFlag, (err) => {
        if (err) {
          console.log("can't delete file.");
        }
        console.log("File is deleted.");
    });
    
    } else {
      req.body.flag = req.body.oldFlag;
    }
    console.log("multer after",req.body.flag)
    CountryConfig.update(
      {
        CountryName: req.body.CountryName,
        country: req.body.country,
        language: req.body.language,
        languageCode: req.body.languageCode,
        lang: req.body.lang,
        dir: req.body.dir,
        flag: req.body.flag,
      },
      { where: { id: req.body.id } }
    )
      .then(() => {
        result.returnCode = 0;
        result.returnMessage = "Country has been updated!";
        res.json(result);
      })
      .catch(() => {
        result.returnCode = -1;
        result.returnMessage = "Country wasn't updated. Try again, please.";
        res.json(result);
      });
  }
//}
  })
})






module.exports = router;
