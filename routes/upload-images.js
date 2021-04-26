var express = require("express");
const { } = require("../config/database");
var router = express.Router();
//const multer = require('multer')
const sharp = require('sharp');
//const log = require('./log');

router.post('/upload', (req, res) => {
  debugger;
  const crypto = require("crypto");
  const id = crypto.randomBytes(16).toString("hex");

  var pngExpresssion = new RegExp(/data:image\/png;base64/);
  var jpegExpression = new RegExp(/data:image\/jpeg;base64/);
  var jpgExpression = new RegExp(/data:image\/jpg;base64/);
  var gifExpression = new RegExp(/data:image\/gif;base64/);

  var base64Data = "";
  var filepath = "";

  if (pngExpresssion.test(req.body.file)) {
    base64Data = req.body.file.replace(/^data:image\/png;base64,/, "");
    filepath = req.body.ImagePath + id + "_Image.png";
  }

  if (jpegExpression.test(req.body.file)) {
    base64Data = req.body.file.replace(/^data:image\/jpeg;base64,/, "");
    filepath = req.body.ImagePath + id + "_Image.jpeg";
  }

  if (jpgExpression.test(req.body.file)) {
    base64Data = req.body.file.replace(/^data:image\/jpg;base64,/, "");
    filepath = req.body.ImagePath + id + "_Image.jpg";
  }
  if (gifExpression.test(req.body.file)) {
    base64Data = req.body.file.replace(/^data:image\/gif;base64,/, "");
    filepath = req.body.ImagePath + id + "_Image.gif";
  }

  var imagesrc = filepath.replace(req.body.ImagePath, '');
  require("fs").writeFile(filepath, base64Data, 'base64', function (err) {
    debugger
    if (!err) {
      sharp(filepath).resize(350,200).toFile('images/350x200/' + imagesrc, function (err) {
        debugger
        if (err)
        Console.log(err)
         //log.CreateLog(err, null);
      });

      sharp(filepath).resize(172,90).toFile('images/172x90/' + imagesrc, function (err) {
        debugger
        if (err)
        Console.log(err)
          //log.CreateLog(err, null);
      });

      sharp(filepath).resize(750,300).toFile('images/750x300/' + imagesrc, function (err) {
        debugger
        if (err)
        Console.log(err)
          //log.CreateLog(err, null);
      });

      // sharp(filepath).resize(120,120).toFile('images/120x120') +imagesrc ,function(err)
      // {
      //   debugger
      //   if (err)
      //     log.CreateLog(err, null);
      // }

      res.json({ ImagePath: 'images/350x200/' + imagesrc, file: filepath  ,SmallImagePath: 'images/172x90/' + imagesrc, LargeImagePath:'images/750x300/' + imagesrc});
    }
    else {
      debugger
      Console.log(err.message)
      //log.CreateLog(err.message, null);
      res.json({ Error: err.message });
    }
  }); 
});

router.post("/uploadoriginal", (req, res) => {
  const crypto = require("crypto");
  const id = crypto.randomBytes(16).toString("hex");

  var pngExpresssion = new RegExp(/data:image\/png;base64/);
  var jpegExpression = new RegExp(/data:image\/jpeg;base64/);
  var jpgExpression = new RegExp(/data:image\/jpg;base64/);
  var gifExpression = new RegExp(/data:image\/gif;base64/);

  var base64Data = "";
  var filepath = "";

  if (pngExpresssion.test(req.body.file)) {
    base64Data = req.body.file.replace(/^data:image\/png;base64,/, "");
    filepath = req.body.ImagePath + id + "_Image.png";
  }

  if (jpegExpression.test(req.body.file)) {
    base64Data = req.body.file.replace(/^data:image\/jpeg;base64,/, "");
    filepath = req.body.ImagePath + id + "_Image.jpeg";
  }

  if (jpgExpression.test(req.body.file)) {
    base64Data = req.body.file.replace(/^data:image\/jpg;base64,/, "");
    filepath = req.body.ImagePath + id + "_Image.jpg";
  }
  if (gifExpression.test(req.body.file)) {
    base64Data = req.body.file.replace(/^data:image\/gif;base64,/, "");
    filepath = req.body.ImagePath + id + "_Image.gif";
  }

  var imagesrc = filepath.replace(req.body.ImagePath, "");
  require("fs").writeFile(filepath, base64Data, "base64", function (err) {
    if (!err) {
      res.json({ ImagePath: "images/cartype/" + imagesrc });
    } else {
      res.json({ Error: err.message });
    }
  });
});

module.exports = router;
