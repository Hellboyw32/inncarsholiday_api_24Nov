var express = require("express");
const {
  sequelize,
  User,
  Role,
  UserProfile,
  AgencyProfile
} = require("../config/database");
const Op = require("sequelize").Op;
var router = express.Router();



router.get("/", function (request, response) {
  var pageSize = request.query.page_size;
  var page = request.query.page;
  var search = {
    where: {},
    include: [{
      model: Role
    },
    {
      model: UserProfile
    }
    ]
  };
  debugger
  if (request.query.search != null) {

    var n = request.query.search.indexOf("@");
    if (n != -1) {
      if (request.query.agency) {
        search.where = {
          Email: {
            [Op.like]: request.query.search + "%"
          },
          AgencyId: request.query.agency
        };
      } else {
        search.where = {
          Email: {
            [Op.like]: request.query.search + "%"
          },
        };
      }
    } else {

      if (request.query.agency) {
        search.include[1].where = {
          FirstName: {
            [Op.like]: request.query.search + "%"
          },
          [Op.or]: {
            LastName: {
              [Op.like]: request.query.search + "%"
            }
          },
          AgencyId: request.query.agency
        };
      } else {
        search.include[1].where = {
          FirstName: {
            [Op.like]: request.query.search + "%"
          },
          [Op.or]: {
            LastName: {
              [Op.like]: request.query.search + "%"
            }
          }
        };
      }
    }
  } else {
    if (request.query.agency) {
      search.where = {
        AgencyId: request.query.agency
      }
    }
  }

  var result = {
    returnCode: 0,
    count: 0,
    data: null,
    returnMessage: ""
  };
  User.findAndCount(search).then(model => {
    debugger
    result.count = model.count;
    result.data = model.rows.slice((page - 1) * pageSize, page * pageSize);
    result.returnCode = 0;
    response.json(result);
  }).catch(err => {
    debugger
    response.send(err);
  })
});


//Get all User
router.get("/venderall", function (request, responce) {
  debugger
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: ""
  };
  User.findAll({ where: { RoleId: 3, IsApproved: true, IsEmailVerified: true }, include: [{ model: UserProfile }] }).then(vender => {
    result.returnCode = 1;
    result.returnMessage = "Successfull";
    result.data = vender;
    responce.json(result);
  }).catch(err => {
    result.returnCode = -1;
    result.returnMessage = "server Error";
    responce.json(result);
  })

})


// Add user
router.post("/create", function (request, response) {
  debugger;
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: ""
  };
  //request.body.Password = EncriptionHelper.Ecription(request.body.Password);
  //request.body.EmailVerificationId = GetUID.GenerateUID();

  User.create(request.body, {
    include: [{
      model: UserProfile
    }]
  }).then(user => {
    debugger
    //EmailHelper.Registration(user.Email, user.EmailVerificationId);
    result.returnCode = 0;
    result.data = user;
    result.returnMessage = "Success";
    response.json(result);
  }).catch(err => {
    debugger
    result.returnCode = -1;
    result.returnMessage = "Server Error";
    response.json(result);
  })
});

//Get users by id
router.get("/:id", function (request, response) {
  debugger
  var result = {
    returnCode: 0,
    count: 0,
    data: null,
    returnMessage: ""
  };
  User.findByPk(request.params.id, { include: [{ model: Role }, { model: UserProfile }, { model: AgencyProfile }] }).then(res => {
    debugger
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
});
//activate the user
router.post("/activate", function (request, response) {
  //debugger
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: ""
  };
  User.findByPk(request.body.Id).then(user => {
    if (user != null) {
      user.IsActive = true;
      user.save();
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
//Bloack The user
router.post("/block", function (request, response) {
  //debugger
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: ""
  };
  User.findByPk(request.body.Id).then(user => {
    if (user != null) {
      user.IsBlocked = request.body.IsBlocked;
      user.save();
      if (request.body.IsBlocked) {
        result.returnMessage = "User has blocked";
      } else {
        result.returnMessage = "User has unblocked"
      }
    } else {
      result.returnCode = -1;
      result.returnMessage = "User not found"
    }

    response.json(result);
  }).catch(err => {
    response.send(err);
  })
});
//Approved the user
router.post("/approve", function (request, response) {
  //debugger
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: ""
  };
  User.findByPk(request.body.Id).then(user => {
    if (user != null) {
      user.IsApproved = request.body.IsApproved;
      user.save();
      if (request.body.IsApproved) {
        result.returnMessage = "User has approved";
      } else {
        result.returnMessage = "User has unapproved"
      }
    } else {
      result.returnCode = -1;
      result.returnMessage = "User not found";
    }

    response.json(result);
  }).catch(err => {
    response.send(err);
  })
});
//Deactivate the user 
router.post("/deactivate", function (request, response) {
  //debugger
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: ""
  };
  User.findByPk(request.body.Id).then(user => {
    if (user != null) {
      user.IsActive = false;
      user.save();
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
//check Exist email
router.post("/emailexist", function (request, response) {
  debugger
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: ""
  };
  User.findOne({
    where: {
      Email: request.body.Email,
      Id: {
        [Op.ne]: request.body.Id
      }
    }
  }).then(user => {
    if (user == null) {
      result.returnCode = 0;
      result.returnMessage = "User not exists";
    } else {
      result.returnCode = -1;
      result.returnMessage = "User already exist";
    }
    response.json(result);
  }).catch(err => {
    result.returnCode = -1;
    result.returnMessage = "Server Error";
    response.json(result);
  });
});


// login api
router.post("/login", function (request, response) {
  debugger
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: ""
  };
  User.findOne({
    where: {
      Email: request.body.Email,
      IsActive: true
    },
    include: [{
      model: UserProfile
    },
    //  {
    //   model: AgencyProfile
    // }
  ]
  }).then(user => {
    if (user == null) {
      result.returnCode = -1;
      result.returnMessage = "Invalid Credentials.";
    } else if (user.IsEmailVerified == false) {
      result.returnCode = -1;
      result.returnMessage = "Email is not verified.";
    } else if (user.IsActive == false) {
      result.returnCode = -1;
      result.returnMessage = "Account is not active.";
    } else {
      debugger;
      //var password = EncriptionHelper.Decription(user.Password);
      var password = user.Password;
      if (password == request.body.Password) {
        result.returnMessage = "Success";
        user.Password = password;
        result.data = user;
      } else {
        result.returnCode = -1;
        result.returnMessage = "Invalid Password";
      }
    }
    response.json(result);
  }).catch(err => {
    console.log(err);
    result.returnCode = -1;
    result.returnMessage = "Server Error";
    response.json(result);
  });
});


//logo pic 
router.post("/logo", function (request, response) {
  debugger
  var result = { returnCode: 0, data: null, returnMessage: "" };

  var pngExpresssion = new RegExp(/data:image\/png;base64/);
  var jpegExpression = new RegExp(/data:image\/jpeg;base64/);
  var jpgExpression = new RegExp(/data:image\/jpg;base64/);
  var jpgExpression = new RegExp(/data:image\/jpg;base64/);
  var gifExpression = new RegExp(/data:image\/gif;base64/);
  var base64Data = "";
  var filepath = "";
  if (pngExpresssion.test(request.body.LogoPath)) {
    base64Data = request.body.LogoPath.replace(/^data:image\/png;base64,/, "");
    filepath = "images/user-pic/Logo_" + Date.now() + "_Image.png";
  }

  if (jpegExpression.test(request.body.LogoPath)) {
    base64Data = request.body.LogoPath.replace(/^data:image\/jpeg;base64,/, "");
    filepath = "images/user-pic/Logo_" + Date.now() + "_Image.jpeg";
  }

  if (jpgExpression.test(request.body.LogoPath)) {
    base64Data = request.body.LogoPath.replace(/^data:image\/jpg;base64,/, "");
    filepath = "images/user-pic/Logo_" + Date.now() + "_Image.jpg";
  }
  if (gifExpression.test(request.body.LogoPath)) {
    base64Data = request.body.LogoPath.replace(/^data:image\/gif;base64,/, "");
    filepath = "images/user-pic/Logo_" + Date.now() + "_Image.gif";
  }
  require("fs").writeFile(filepath, base64Data, 'base64', function (err) {
    console.log(err);
  });

  UserProfile.sequelize.query('UPDATE UserProfile SET ProfilePicPath = ' + "'" + filepath + "'" + ' WHERE UserId = ' + request.body.Id).then(res => {
    if(res!=null)
    {
      result.returnCode = 1
    result.returnMessage = "Success"
    

    }
    else
    {
      result.returnMessage="User Not Found"
    }
    response.json(result);
    
  }).catch(err => {
    debugger
    response.send(err)
  })


});


//update user with user Profile 

router.post("/updateuser/:Id", function (request, response) {
  debugger
  var result = {
    returnCode: 0,
    returnMessage: ""
  };

  UserProfile.sequelize.query('UPDATE UserProfile SET FirstName = ' + "'" + request.body.FirstName + "'" + ', Phone = ' + "'" + request.body.Phone + "'" + ', City = ' + request.body.City +
    ' , Country = ' + request.body.Country + ' WHERE Id = ' + request.params.Id).then(res => {
      if (res != null) {
        result.returnMessage = "successfull",
          result.returnCode = 1;

      }
      else {
        result.returnMessage = "User Not Found";
      }
      response.json(result)
    }).catch(err => {
      result.returnMessage = "server Error";
      result.returnCode = -1;
      response.json(result);
    })
})







module.exports = router;
