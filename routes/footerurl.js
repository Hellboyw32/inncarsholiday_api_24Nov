var express = require("express");
const {
  sequelize,
FooterUrl,
FooterUrldata,
FooterHeader
} = require("../config/database");
const Op = require("sequelize").Op;
var router = express.Router();



router.get("/getAllFooterHeader", function (request, response) {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: "",
  };
  FooterHeader.findAll({ where: { IsActive: true }, include: [{ model: FooterUrl, where: {IsActive: true}, required: false }] })
    .then((res) => {
      result.returnCode = 1;
      result.returnMessage = "Successfull";
      result.data = res;
      response.json(result);
    })
    .catch((err) => {
      result.returnCode = -1;
      result.returnMessage = "Server Error";
      response.json(result);
    });
});

//Get all FooterData
router.get("/getFooterUrlData", function (request, responce) {
    var result = {
      returnCode: 0,
      data: null,
      returnMessage: ""
    };
    FooterUrl.findAll({where: {IsActive: true} }).then(response => {
      result.returnCode = 1;
      result.returnMessage = "Successfull";
      result.data = response;
      responce.json(result);
    }).catch(err => {
      result.returnCode = -1;
      result.returnMessage = "server Error";
      responce.json(result);
    })
  })

  router.get("/getAllFooterUrlData", function (request, responce) {
    var result = {
      returnCode: 0,
      data: null,
      returnMessage: ""
    };
    FooterUrldata.findAll({where: {IsActive: true}, include: [{ model: FooterUrl, where: {IsActive: true} }] }).then(response => {
      result.returnCode = 1;
      result.returnMessage = "Successfull";
      result.data = response;
      responce.json(result);
    }).catch(err => {
      result.returnCode = -1;
      result.returnMessage = err;
      responce.json(result);
    })
  })

  router.get("/getFooterUrlDataById/:Id", function(request, response){
    var result = {
        returnCode: 0,
        data: null,
        returnMessage: ""
    };
    var Id = parseInt(request.params.Id);
    FooterUrldata.findByPk(Id).then(res => {
        if(res){
            result.returnCode = 0;
            result.returnMessage = "Success";
            result.data = res;
            response.json(result);
        }else{
            result.returnCode = 0;
            result.returnMessage = "Didn't find any!";
            result.data = null;
            response.json(result);
        }
    }).catch(error => {
        result.returnCode = -1;
        result.returnMessage = "Something went wrong!";
        result.data = error;
        response.json(result);
    });
});

  router.get("/getFooterUrlDataByFooterURLID/:Id", function(request, response){
    var result = {
        returnCode: 0,
        data: null,
        returnMessage: ""
    };
    var Id = parseInt(request.params.Id);
    FooterUrldata.findAll({where: {FooterUrlId: Id, IsActive: true}}).then(res => {
        if(res.length > 0){
            result.returnCode = 0;
            result.returnMessage = "Success";
            result.data = res;
            response.json(result);
        }else{
            result.returnCode = 0;
            result.returnMessage = "Didn't find any!";
            result.data = null;
            response.json(result);
        }
    }).catch(error => {
        result.returnCode = -1;
        result.returnMessage = "Something went wrong!";
        result.data = error;
        response.json(result);
    });
});

router.get("/checkfooterurlbyid/:id", function(request, response){
    var result = {
        returnCode: 0,
        data: null,
        returnMessage: ""
    };
    var Id = parseInt(request.params.id);
    FooterUrldata.findAll({where: {FooterUrlId: Id, IsActive: true}}).then(res => {
        if(res.length > 0){
            result.returnCode = 0;
            result.returnMessage = "Success";
            result.data = res;
            response.json(result);
        }else{
            result.returnCode = 0;
            result.returnMessage = "Didn't find any!";
            result.data = null; 
            response.json(result);
        }
    }).catch(error => {
        result.returnCode = -1;
        result.returnMessage = "Something went wrong!";
        result.data = error;
        response.json(result);
    })
})



router.get("/getAllFooterURL", function (request, responce) {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: "",
  };
  FooterUrl.findAll({where: {IsActive: true}, include: [{ model: FooterHeader, where: {IsActive: true} }] })
    .then((response) => {
      result.returnCode = 1;
      result.returnMessage = "Successfull";
      result.data = response;
      responce.json(result);
    })
    .catch((err) => {
      result.returnCode = -1;
      result.returnMessage = err;
      responce.json(result);
    });
});

router.get("/getfooterurlbyid/:id", function(request, response){
  var result = {
      returnCode: 0,
      data: null,
      returnMessage: ""
  };
  FooterUrl.findByPk(request.params.id).then(res => {
    
    if (res) {
      result.data = res
      result.returnCode = 0;
      response.json(result);
    } else {
      result.returnCode = -1;
      result.returnMessage = "User not found"
      response.json(result);
    }
  }).catch(err => {
    response.send(err);
  })
})


router.post("/createFooterHeader", function (request, response) {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: ""
  };
  FooterHeader.create(request.body).then(res => {
    
    result.returnCode = 0;
    result.data = res;
    result.returnMessage = "Success";
    response.json(result);
  }).catch(err => {
    
    result.returnCode = -1;
    result.returnMessage = "Server Error";
    response.json(result);
  })
});

router.post("/createFooterUrl", function (request, response) {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: ""
  };
  FooterUrl.create(request.body).then(res => {
    
    result.returnCode = 0;
    result.data = res;
    result.returnMessage = "Success";
    response.json(result);
  }).catch(err => {
    
    result.returnCode = -1;
    result.returnMessage = "Server Error";
    response.json(result);
  })
});

router.post("/deactivatefooterurl/:Id", function (request, response) {
  //
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: ""
  };
  FooterUrl.findByPk(request.params.Id).then(res => {
    if (res != null) {
      res.IsActive = false;
      res.save();
      result.returnMessage = "Success"
    } else {
      result.returnCode = -1;
      result.returnMessage = "User not found"
    }
    response.json(result);
  }).catch(err => {
    response.send(err);
  })
});

router.post("/deactivatefooterurldata/:Id", function (request, response) {
  //
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: ""
  };
  FooterUrldata.findByPk(request.params.Id).then(res => {
    if (res != null) {
      result.returnMessage = "Success!";
      res.IsActive = false;
      res.save().then(() => {
        result.returnCode = 1;
        response.json(result);
      })
    } else {
      result.returnCode = -1;
      result.returnMessage = "User not found";
      response.json(result);
    }
  }).catch(err => {
    response.send(err);
  })
});

// Add user
router.post("/create", function (request, response) {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: ""
  };
  FooterUrldata.create(request.body).then(res => {
    
    result.returnCode = 0;
    result.data = res;
    result.returnMessage = "Success";
    response.json(result);
  }).catch(err => {
    
    result.returnCode = -1;
    result.returnMessage = "Server Error";
    response.json(result);
  })
});

router.post("/updatefooterdata", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  FooterUrldata.findByPk(request.body.Id)
    .then((footerData) => {
      footerData.Data = request.body.Data;
      footerData.FooterUrlId = request.body.FooterUrlId;
      footerData
        .save()
        .then(() => {
          result.returnCode = 1;
          result.data = true;
          result.returnMessage = "Footer data has been updated!";
        })
        .catch(() => {
          result.returnCode = -1;
          result.data = false;
          result.returnMessage = "Something went wrong!";
        })
        .finally(() => response.json(result));
    })
    .catch(() => {
      result.returnCode = -1;
      result.data = false;
      result.returnMessage = "Record not found!";
      response.json(result);
    });
});


router.post("/updatefooterurl/:id", function (request, response) {
  
  var result = { returnCode: 0, data: null, returnMessage: "" };
  FooterUrl.findByPk(request.params.id)
    .then(res => {
      if (res != null) {
        res.Name = request.body.Name;
        res.FooterHeaderId = request.body.FooterHeaderId;
        res.Url = request.body.Url;
        res.save();
        result.data = res;
        result.returnMessage = "Success";
      } else {
        result.returnCode = -1;
        result.returnMessage = "FooterUrl not found";
      }
      response.json(result);
    })
    .catch(err => {
      response.send(err);
    });
});


router.get("/deleteFooterHeader/:id", function(request, response){
  var result = {
      returnCode: 0,
      data: null,
      returnMessage: ""
  };
  FooterHeader.findByPk(request.params.id).then(res => {
    
    if (res) {
      res.IsActive = false;
      res.save();
      result.returnCode = 0;
      response.json(result);
    } else {
      result.returnCode = -1;
      result.returnMessage = "Footer header not found"
      response.json(result);
    }
  }).catch(err => {
    response.send(err);
  })
})

router.post("/updatefooterheader/:id", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  FooterHeader.findByPk(request.params.id)
    .then((res) => {
      if (res != null) {
        res.Name = request.body.Name;
        res.IsActive = true;
        res.save();
        result.data = res;
        result.returnMessage = "Success";
      } else {
        result.returnCode = -1;
        result.returnMessage = "FooterUrl not found";
      }
      response.json(result);
    })
    .catch((err) => {
      response.json(err);
    });
});


module.exports = router;
