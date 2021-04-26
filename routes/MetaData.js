const { response } = require("express");
var express = require("express");
const {
    MetaData,
    MetaPages,
    MetaTag,
    Scripts
} = require("../config/database");
var router = express.Router();
const Op = require("sequelize").Op;



async function getAllScripts() {
    let result = {};
    await Scripts.findAndCountAll()
      .then((data) => {
        result.returnCode = 1;
        if (data) {
          result.data = data.rows;
          result.count = data.count;
          result.returnMessage = "Scripts successfully loaded!";
        } else {
          result.returnMessage = "No Scripts found!";
        }
      })
      .catch((error) => {
        console.log(error);
        result.returnCode = -1;
        result.returnMessage = "Server error occured!";
      });
    return result;
  }

  router.get('scripts/:id', function (request, response) {
    var result = { returnCode: 0, data: null, returnMessage: "" };
    Scripts.findByPk(request.params.id).then(data => {
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

router.post("/createscripts", function (request, response) {
    var model = {
        SRC: request.body.SRC,
    }
    var result = { returnCode: 0, data: null, returnMessage: "" };
    Scripts.create(model).then(metaData => {
        getAllMetaData(1, 10, null).then((data) => {
            response.json(data);
          });
    }).catch(err => {
        result.returnCode = -1;
        result.returnMessage = "Server Error";
        response.json(result);
    })
});

router.get("/allscripts", function (request, response) {
    getAllScripts().then((data) => {
      response.json(data);
    });
  });

router.delete("/deletescript/:id", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  Scripts.destroy({
    where: {
      Id: request.params.id,
    },
  })
    .then(() => {
      getAllScripts().then((data) => {
        response.json(data);
      });
    })
    .catch((err) => {
      result.returnCode = -1;
      result.returnMessage = "Server Error";
      response.json(result);
    });
});

async function getAllMetaData(page, pageSize, search) {
    // , status = 0
    console.log(page,pageSize,search)
    let limit = pageSize;
    let offset = (page - 1) * pageSize;
    let result = {};
    let requestParams = {
      limit,
      offset,
      where: { IsActive: true },
      order: [["Id", "DESC"]],
      include: [{ model: MetaPages }, { model: MetaTag }]
    };
  
    if (search && search != "" && search != "empty" && search != "null") {
      requestParams.where = {
        [Op.or]: [
            { "$metapage.PageName$": { [Op.like]: search + "%" } },
            { "$metatag.Name$": { [Op.like]: search + "%" } },
        ],
      };
    }
  
    await MetaData.findAndCountAll(requestParams)
      .then((data) => {
        result.returnCode = 1;
        if (data) {
          result.data = data.rows;
          result.count = data.count;
          result.returnMessage = "Meta Data successfully loaded!";
        } else {
          result.returnMessage = "No Meta Data found!";
        }
      })
      .catch((error) => {
        console.log(error);
        result.returnCode = -1;
        result.returnMessage = "Server error occured!";
      });
    return result;
  }

//All MetaDatas
router.get("/", function (request, response) {
    
    var result = { returnCode: 0, data: null, returnMessage: "" };
    MetaData.findAll({ order: [['Tag', 'ASC']] }).then(metaDatas => {
        result.data = metaDatas;
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


//All MetaTags
router.get("/metatags", (req, res) => {
    let result = {};
    MetaTag.findAll().then(metatags => {
        result.data = metatags;
        result.returnMessage = "Success";
    }).catch(error => {
        result.returnCode == -1;
        result.returnMessage = "Server error";
    }).finally(() => res.json(result)); 
})

//All MetaDatas
router.get("/pages", function (request, response) {
    let result = {};
    MetaPages.findAll().then(metapages => {
        result.data = metapages;
        result.returnMessage = "Success";
    }).catch(error => {
        result.returnCode = -1;
        result.returnMessage = "Server Error";
    }).finally(() => response.json(result));
});

router.get("/getbypage/:name", function (request, response) {
  let result = {};
  MetaPages.findAll({
    where: { PageName: request.params.name },
    include: [
      {
        model: MetaData,
        where: { IsActive: true },
        include: [{ model: MetaTag }],
      },
    ],
  })
    .then((metapages) => {
      result.data = metapages;
      result.returnMessage = "Success";
    })
    .catch((error) => {
      result.returnCode = -1;
      result.returnMessage = error;
    })
    .finally(() => response.json(result));
});

//Paged Meta Data   
router.get("/data/:page/:pageSize/:search?", function (request, response) {
    getAllMetaData(+request.params.page, +request.params.pageSize, request.params.search).then((data) => {
      response.json(data);
    });
  });

// Get metaData By Id
router.get('/:id', function (request, response) {
    
    var result = { returnCode: 0, data: null, returnMessage: "" };
    MetaData.findByPk(request.params.id).then(data => {
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

// Add metaData
router.post("/create", function (request, response) {
  var model = {
    PageId: request.body.PageId,
    TagId: request.body.TagId,
    Content: request.body.Content,
    IsActive: 1,
  };
  var result = { returnCode: 0, data: null, returnMessage: "" };
  MetaData.findAll({
    where: { IsActive: true, PageId: model.PageId, TagId: model.TagId },
  })
    .then((metapages) => {
      console.log(metapages);
      if (metapages != null && metapages.length > 0) {
        result.returnCode = 3;
        response.json(result);
      } else {
        MetaData.create(model)
          .then((metaData) => {
            getAllMetaData(1, 10, null).then((data) => {
              response.json(data);
            });
          })
          .catch((err) => {
            console.log(err);
            result.returnCode = -1;
            result.returnMessage = "Server Error";
            response.json(result);
          });
      }
    })
    .catch((error) => {
      console.log(error);
      result.returnCode = -1;
      result.returnMessage = "Server Error";
    });
});

router.post("/update/:id", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  MetaData.findByPk(request.params.id)
    .then((metaDatas) => {
      if (metaDatas != null) {
        metaDatas.PageId = request.body.PageId;
        metaDatas.Tag = request.body.Tag;
        metaDatas.Content = request.body.Content;
        metaDatas.save().then(() => {
          getAllMetaData(1, 10, null).then((data) => {
            response.json(data);
          });
        });
      } else {
        result.returnCode = -1;
        result.returnMessage = "MetaData not found";
        response.json(result);
      }
    })
    .catch((err) => {
      response.send(err);
    });
});

router.post("/delete/:id", function (request, response) {
    var result = { returnCode: 0, data: null, returnMessage: "" };
    MetaData.findByPk(request.params.id).then(metaData => {
        metaData.IsActive = false;
        metaData.save().then(() => {
            result.data = true;
            result.returnMessage = "Success";
            response.json(result);
            });
    }).catch(err => {
        result.returnCode = -1;
        result.returnMessage = "Server Error";
        response.json(result);
    })
});

router.post("/metaDataexist", function (request, response) {
    
    var result = { returnCode: 0, data: null, returnMessage: "" };
    MetaData.findOne({ where: { Tag: request.body.Name, Id: { [Op.ne]: request.body.Id } } }).then(metaData => {
        if (metaData == null) {
            result.returnCode = 0;
            result.returnMessage = "metaData not exists";
        }
        else {
            result.returnCode = -1;
            result.returnMessage = "metaData already exist";
        }
        response.json(result);
    }).catch(err => {
        result.returnCode = -1;
        result.returnMessage = "Server Error";
        response.json(result);
    });
});

module.exports = router;
