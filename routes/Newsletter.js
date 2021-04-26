var express = require("express");
const {
    Newsletter,
    Template
} = require("../config/database");
var router = express.Router();
const Op = require("sequelize").Op;

//All Newsletters
router.get("/", function (request, response) {
    
    var result = { returnCode: 0, data: null, returnMessage: "" };
    Newsletter.findAll( {where: {IsActive: true}}).then(newsletters => {
        result.data = newsletters;
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



router.get("/getallsubscribers", function (request, response) {
    
    var result = { returnCode: 0, data: null, returnMessage: "" };
    Newsletter.aggregate( 'Email', 'DISTINCT', { plain: false, where: {IsActive: true, IsSubscribe: true} } ).then(newsletters => {
        result.data = newsletters;
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

router.get("/getalltemplates", function (request, response) {
    var result = { returnCode: 0, data: null, returnMessage: "" };
    Template.findAll().then(templates => {
        result.data = templates;
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

//All Newsletters
router.get("/paging/all", function (request, response) {
    
    var pageSize = request.query.page_size;
    var page = request.query.page;
    var result = { returnCode: 0, count: 0, data: null, returnMessage: "" };
    search = {
        where: {IsActive: true},
        order: []
    }
    if (request.query.search) {
        search.where = { IsActive: true,
            Email: { [Op.like]: request.query.search + "%" },
        }
    }
    else {
        search.order.push(['Id', 'DESC']);
    }

    Newsletter.findAndCountAll(search).then(newsletters => {
        
        result.count = newsletters.count;
        result.data = newsletters.rows.slice((page - 1) * pageSize, page * pageSize);
        result.returnCode = 0;
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

router.get('/newsletters', (request, response) => {
    var result = { returnCode: 0, data: null, returnMessage: "" };
    Newsletter.findAll({
        where: {
            Id: request.query.newsletters.split(",")
        },
        order: [['Email', 'ASC']]

    }).then(data => {
        result.data = data;
        response.json(result);
    }).catch(err => {

    });
});
router.get('/gettemplatebyid/:id', function(request, response){
    var result = { returnCode: 0, data: null, returnMessage: "" };
    Template.findByPk(request.params.id).then(data => {
        if(data != null){
            result.returnMessage = "Success";
            result.returnCode = 1;
            result.data = data;
            response.json(result);
        }else{
            result.returnMessage = "data not find";
            response.json(result);
        }
    }).catch(error => {
        result.returnMessage = "server error";
        result.returnCode = -1;
        response.json(result);
    })
});

// Get newsletter By Id
router.get('/:id', function (request, response) {
    
    var result = { returnCode: 0, data: null, returnMessage: "" };
    Newsletter.findByPk(request.params.id).then(data => {
        if (data != null) {
            result.returnMessage = "success";
            result.returnCode = 1;
            result.data = data;
            response.json(result);
        }
        else {
            result.returnMessage = "data not find";
            response.json(result);
        }

    }).catch(err => {
        result.returnMessage = "server error";
        result.returnCode = -1;
        response.json(result);

    })

});


// Add newsletter
router.post("/create", function (request, response) {

    var result = { returnCode: 0, data: null, returnMessage: "" };
    Newsletter.create(request.body).then(newsletter => {

        result.data = newsletter;
        result.returnMessage = "Success";
        response.json(result);
    }).catch(err => {
        result.returnCode = -1;
        result.returnMessage = "Server Error";
        response.json(result);
    })
});

router.post("/createtemplate", function(request, response){
    var result = { returnCode: 0, data: null, returnMessage: "" };
    Template.create(request.body).then(template => {
        result.returnCode = 1;
        result.data = template;
        result.returnMessage = "Success";
        response.json(result);
    }).catch(err => {
        result.returnCode = -1;
        result.returnMessage = "Server Error";
        response.json(result);
    })
});



router.post("/updatetemplate/:id", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  Template.findByPk(request.params.id)
    .then((newsletters) => {
      if (newsletters != null) {
        newsletters.Templatetype = request.body.Templatetype;
        newsletters.TemplateSubject = request.body.TemplateSubject;
        newsletters.SenderName = request.body.SenderName;
        newsletters.SenderEmail = request.body.SenderEmail;
        newsletters.TemplateContent = request.body.TemplateContent;
        newsletters
          .save()
          .then(() => {
            result.returnCode = 1;
            result.data = newsletters;
            result.returnMessage = "Success";
            response.json(result);
          })
          .catch(() => {
            result.returnCode = -1;
            result.returnMessage = "Something went wrong!";
            response.json(result);
          });
      } else {
        result.returnCode = -1;
        result.returnMessage = "Newsletter not found";
        response.json(result);
      }
    })
    .catch((err) => {
      response.send(err);
    });
});

router.get("/checkexisting/:email", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  Newsletter.count({ where: { Email: request.params.email, IsSubscribe: 1 } })
    .then((res) => {
      if (res) {
        result.returnCode = 1;
        result.data = res;
        result.returnMessage = "Success";
        response.json(result);
      } else {
        result.returnCode = 1;
        result.data = null;
        result.returnMessage = "Success";
        response.json(result);
      }
    })
    .catch((err) => {
      result.returnCode = 0;
      result.data = err;
      response.json(err);
    });
});

router.post("/update/:id", function (request, response) {

    var result = { returnCode: 0, data: null, returnMessage: "" };
    Newsletter.findByPk(request.params.id).then(newsletters => {
        if (newsletters != null) {
            newsletters.Email = request.body.Email;
            newsletters.save();
            result.data = newsletters;
            result.returnMessage = "Success"
        }
        else {
            result.returnCode = -1;
            result.returnMessage = "Newsletter not found"
        }
        response.json(result);
    }).catch(err => {
        response.send(err);
    });
});

router.post("/delete/:id", function (request, response) {
    var result = { returnCode: 0, data: null, returnMessage: "" };
    Newsletter.destroy({ where: { Id: request.params.id } }).then(newsletter => {
        result.data = true;
        result.returnMessage = "Success";
        response.json(result);
    }).catch(err => {
        result.returnCode = -1;
        result.returnMessage = "Server Error";
        response.json(result);
    })
});

router.post("/deletetemplate/:id", function (request, response) {
    var result = { returnCode: 0, data: null, returnMessage: "" };
    Template.destroy({ where: { Id: request.params.id } }).then(newsletter => {
        result.returnCode = 1;
        result.data = true;
        result.returnMessage = "Success";
        response.json(result);
    }).catch(err => {
        result.returnCode = -1;
        result.returnMessage = "Server Error";
        response.json(result);
    })
});

router.post("/unsubscribe/:id", function (request, response) {
    var result = { returnCode: 0, data: null, returnMessage: "" };
    
    Newsletter.findByPk(request.params.id).then(newsletters => {
        newsletters.IsSubscribe = 0;
        newsletters.save();
        result.data = true;
        result.returnMessage = "Success";
        response.json(result);
    }).catch(err => {
        result.returnCode = -1;
        result.returnMessage = "Server Error";
        response.json(result);
    })
});

router.post("/subscribe/:id", function (request, response) {
    
    var result = { returnCode: 0, data: null, returnMessage: "" };
    Newsletter.findByPk(request.params.id).then(newsletters => {
        newsletters.IsSubscribe = 1;
        newsletters.save();
        result.data = true;
        result.returnMessage = "Success";
        response.json(result);
    }).catch(err => {
        result.returnCode = -1;
        result.returnMessage = "Server Error";
        response.json(result);
    })
});


router.post("/newsletterexist", function (request, response) {
    
    var result = { returnCode: 0, data: null, returnMessage: "" };
    Newsletter.findOne({ where: { Email: request.body.Email, Id: { [Op.ne]: request.body.Id } } }).then(newsletter => {
        if (newsletter == null) {
            result.returnCode = 0;
            result.returnMessage = "newsletter not exists";
        }
        else {
            result.returnCode = -1;
            result.returnMessage = "newsletter already exist";
        }
        response.json(result);
    }).catch(err => {
        result.returnCode = -1;
        result.returnMessage = "Server Error";
        response.json(result);
    });
});

module.exports = router;
