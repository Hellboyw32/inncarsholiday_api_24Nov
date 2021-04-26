var express = require("express");


const {
  sequelize,
  SeoLocationData,
} = require("../config/database");
var router = express.Router();
const Sequelize = require("sequelize");
const Op = require("sequelize").Op;

const multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/seo-images/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now()
    cb(null, uniqueSuffix+"_"+file.originalname)
  }
})

const upload = multer({ storage: storage }).single('image')

router.post("/getmetabycandl", (req, res) => {
  let result = {};
  //let buff = Buffer.from(req.params.Url, 'base64');
  //let text = buff.toString('ascii');
  try {
    let slug = req.body.slug.includes("/blog/") ? req.body.slug.split("/") : req.body.slug;
    let originalslug = '';
    let removed = ''
    if(Array.isArray(slug) && slug.indexOf('blog') > -1){
      removed = slug.splice(slug.length-1,1);
      originalslug = slug.join('/');
    } else {
      originalslug = slug;
    }


  console.log("request body 123====================",req.body,originalslug,removed);
  SeoLocationData.findOne({
    where: { 
        CountryCode: req.body.country,
        Language:req.body.language,
        url: {
            [Op.like]: '%'+originalslug 
        }
    }
  })
    .then((data) => {
      if (data) {
        result.returnCode = 1;
        if(Array.isArray(slug) && slug.indexOf('blog') > -1){
        data.og_url = data.og_url+'/'+removed;
        data.url = data.url+'/'+removed;
        }
        result.data = data;
        result.returnMessage = "Successfull";
        return res.json(result);
      } else {
        result.returnCode = 0;
        result.data = {};
        result.returnMessage = "Successfull";
        return res.json(result); 
      }
    })
    .catch((err) => {
      console.log(err);
      result.returnCode = -1;
      result.returnMessage = "Server Error";
      return res.json(result);
    })
  } catch(err) {
    console.log(err);
    result.returnCode = -1;
    result.returnMessage = "Server Error";
    return res.json(result);
  }
  
});

router.get("/getmetabycandlAll", (req, res) => {
    let result = {};
    //let buff = Buffer.from(req.params.Url, 'base64');
    //let text = buff.toString('ascii');
    //console.log("base64",text);
    SeoLocationData.findAll()
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


  router.post("/create", function (request, response) {
    var result = {
      returnCode: 0,
      data: null,
      returnMessage: "",
    };
    SeoLocationData.create(request.body, {
    })
      .then((locality) => {
        result.data = locality;
        result.returnMessage = "Success";
        response.json(result);
      })
      .catch((err) => {
        console.log(err);
        result.returnCode = -1;
        result.returnMessage = "Server Error";
        response.json(result);
      });
  });
  //update city
  router.post("/update", function (request, response) {
    var result = {
      returnCode: 0,
      data: null,
      returnMessage: "",
    };
    SeoLocationData.findByPk(request.body.id)
      .then((data) => {
    if (data != null) {     
    data.title  = request.body.title;
    data.description  = request.body.description;
    data.keywords  = request.body.keywords;    
    data.url  = request.body.url;
    data.og_url  = request.body.og_url;    
    data.og_type  = request.body.og_type;
    data.og_site_name  = request.body.og_site_name;
    data.og_title  = request.body.og_title;
    data.og_description  = request.body.og_description;
    data.og_image  = request.body.og_image;
    data.og_locale  = request.body.og_locale;
    data.og_localeAlternate  = request.body.og_localeAlternate;
    data.og_fbApp_id  = request.body.og_fbApp_id;
    data.twitter_card  = request.body.twitter_card;
    data.twitter_site  = request.body.twitter_site;
    data.twitter_title  = request.body.twitter_title;
    data.twitter_description  = request.body.twitter_description;
    data.twitter_image  = request.body.twitter_image;
    data.CountryCode  = request.body.CountryCode;
    data.Language  = request.body.Language;
          data.save().then(() => {
            result.data = data;
            result.returnMessage = "Success";
            response.json(result);
          })
        } else {
          result.returnCode = -1;
          result.returnMessage = "seo not found";
          response.json(result);
        }
      })
      .catch((err) => {
        response.send(err);
      });
  });


  router.post("/uploadImage", (req, res) => {
    var result = { returnCode: 0, data: null, returnMessage: "" };
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        result.returnCode = -1;
        result.returnMessage = "Something went wrong!, try again.";
        result.serverError = "";
        res.json(result);
      } else if (err) {
        result.returnCode = -1;
        result.returnMessage = "Something went wrong!, try again.";
        result.serverError = "";
        res.json(result);
      } else {
        result.returnCode = 0;
        result.returnMessage = "Image Uploaded Successfully.";
        result.serverError = "";
        result.image = "images/seo-images/"+req.file.filename
        res.json(result);
      
      
    }
    })


  
  
});
  

module.exports = router;
