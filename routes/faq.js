var express = require("express");
const { sequelize, FaqHeadings, FaqQna, FaqHelpStat } = require("../config/database");
const Op = require("sequelize").Op;
var router = express.Router();


router.get("/getallfaqs/:lang?", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  var selectedAttributes = ['Id', 'Heading', 'IsActive'];
  var selectedQNAAttributes = ['Id', 'Question', 'Answer', 'HeadingId'];
  if (request.params.lang && request.params.lang == "french") {
    selectedAttributes[1] = ['HeadingFrench', 'Heading',];
    selectedQNAAttributes[1] = ['QuestionFrench', 'Question'];
    selectedQNAAttributes[2] = ['AnswerFrench', 'Answer'];
  }
  FaqHeadings.findAll({
    where: { IsActive: true },
    include: [{ model: FaqQna, where: { IsActive: true }, attributes: selectedQNAAttributes,  include: [{ model: FaqHelpStat }] }],
    attributes: selectedAttributes
  })
    .then((res) => {
      result.returnCode = 1;
      result.returnMessage = "Success";
      result.data = res;
      response.json(result);
    })
    .catch((error) => {
      result.returnCode = -1;
      result.returnMessage = error;
      response.json(result);
    });
});

router.get("/getallfaqsbyip/:ipaddress/:lang?", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  var selectedAttributes = ['Id', 'Heading', 'IsActive'];
  var selectedQNAAttributes = ['Id', 'Question', 'Answer', 'HeadingId'];
  if (request.params.lang && request.params.lang == "french") {
    selectedAttributes[1] = ['HeadingFrench', 'Heading',];
    selectedQNAAttributes[1] = ['QuestionFrench', 'Question'];
    selectedQNAAttributes[2] = ['AnswerFrench', 'Answer'];
  }
  FaqHeadings.findAll({
    where: { IsActive: true },
    include: [
      {
        model: FaqQna,
        where: { IsActive: true },
        attributes: selectedQNAAttributes,
        include: [
          {
            model: FaqHelpStat,
            required: false,
            where: { IpAddress: request.params.ipaddress },
          },
        ],
      },
    ],
    attributes: selectedAttributes
  })
    .then((res) => {
      result.returnCode = 1;
      result.returnMessage = "Success";
      result.data = res;
      response.json(result);
    })
    .catch((error) => {
      result.returnCode = -1;
      result.returnMessage = error;
      response.json(result);
    });
});

router.get("/getallfaqheadings/:page/:pageSize", function (request, response) {
  const offset =
    parseInt(request.params.page) * parseInt(request.params.pageSize);
  const limit = parseInt(request.params.pageSize);
  var result = { returnCode: 0, data: null, returnMessage: "" };
  FaqHeadings.findAll({
    limit,
    offset,
    where: { IsActive: true },
  })
    .then((res) => {
      result.returnCode = 1;
      result.returnMessage = "Success";
      result.data = res;
      response.json(result);
    })
    .catch((error) => {
      result.returnCode = -1;
      result.returnMessage = "Something went wrong!";
      response.json(result);
    });
});

router.get("/getallfaqqna/:page/:pageSize", function (request, response) {
  const offset =
    parseInt(request.params.page) * parseInt(request.params.pageSize);
  const limit = parseInt(request.params.pageSize);
  var result = { returnCode: 0, data: null, returnMessage: "" };
  FaqQna.findAll({
    limit,
    offset,
    where: { IsActive: true },
    include: [{ model: FaqHeadings }, { model: FaqHelpStat }],
  })
    .then((res) => {
      result.returnCode = 1;
      result.returnMessage = "Success";
      result.data = res;
      response.json(result);
    })
    .catch((error) => {
      result.returnCode = -1;
      result.returnMessage = error;
      response.json(result);
    });
});

router.post("/addfaqheading", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  FaqHeadings.create(request.body)
    .then((res) => {
      result.returnCode = 1;
      result.returnMessage = "Success!";
      result.data = res;
      response.json(result);
    })
    .catch((error) => {
      result.returnMessage = error;
      result.returnCode = -1;
      response.json(result);
    });
});

router.post("/editfaqheading/", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  FaqHeadings.findByPk(request.body.Id)
    .then((res) => {
      if (res) {
        res.Heading = request.body.Heading;
        res.HeadingFrench = request.body.HeadingFrench;
        res.save().then(() => {
          result.returnCode = 1;
          result.data = res;
          result.returnMessage = "Success!";
          response.json(result);
        })
      }
    })
    .catch((err) => {
      result.returnCode = -1;
      result.returnMessage = "Something went wrong";
      response.json(result);
    });
});

router.get("/deletefaqheading/:Id", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  const limit = 100;
  const offset = 0;
  FaqHeadings.findByPk(request.params.Id)
    .then((res) => {
      if (res) {
        res.IsActive = false;
        res.save().then(
          saveRes => {
            FaqHeadings.findAll({
              limit,
              offset,
              where: { IsActive: true },
            }).then((res) => {
              result.returnCode = 1;
              result.returnMessage = "Success";
              result.data = res;
              response.json(result);
            });
          },
          saveErr => {
            FaqHeadings.findAll({
              limit,
              offset,
              where: { IsActive: true },
            }).then((res) => {
              result.returnCode = 1;
              result.returnMessage = "Success";
              result.data = res;
              response.json(result);
            });
          }
        )
  
      }
    })
    .catch((err) => {
      result.returnCode = -1;
      result.returnMessage = "Something went wrong!";
      response.json(result);
    });
});

router.post("/addfaqqna", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  FaqQna.create(request.body)
    .then(async (res) => {
      await res;
      FaqQna.findAll({
        where: { IsActive: true },
        include: [{ model: FaqHeadings }, { model: FaqHelpStat }],
      }).then((res) => {
        result.returnCode = 1;
        result.returnMessage = "Success";
        result.data = res;
        response.json(result);
      });
    })
    .catch((error) => {
      result.returnMessage = error;
      result.returnCode = -1;
      response.json(result);
    });
});

router.post("/editfaqqna/", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  FaqQna.findByPk(request.body.Id)
    .then((res) => {
      if (res) {
        res.HeadingId = request.body.HeadingId;
        res.Question = request.body.Question;
        res.Answer = request.body.Answer;
        res.QuestionFrench = request.body.QuestionFrench;
        res.AnswerFrench = request.body.AnswerFrench;
        res.save().then(
          saveRes => {
            FaqQna.findAll({
              where: { IsActive: true },
              include: [{ model: FaqHeadings }, { model: FaqHelpStat }],
            }).then((res) => {
              result.returnCode = 1;
              result.returnMessage = "Success";
              result.data = res;
              response.json(result);
            });
          },
          errRes => {
            FaqQna.findAll({
              where: { IsActive: true },
              include: [{ model: FaqHeadings }, { model: FaqHelpStat }],
            }).then((res) => {
              result.returnCode = 1;
              result.returnMessage = "Success";
              result.data = res;
              response.json(result);
            });
          }
        )
      
      }
    })
    .catch((err) => {
      result.returnCode = -1;
      result.returnMessage = "Something went wrong";
      response.json(result);
    });
});

router.get("/deletefaqqna/:Id", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  FaqQna.findByPk(request.params.Id)
    .then((res) => {
      if (res) {
        res.IsActive = false;
        res.save().then(
          saveRes => {
            FaqQna.findAll({
              where: { IsActive: true },
              include: [{ model: FaqHeadings }, { model: FaqHelpStat }],
            }).then((res) => {
              result.returnCode = 1;
              result.returnMessage = "Success";
              result.data = res;
              response.json(result);
            });
          },
          error => {
            FaqQna.findAll({
              where: { IsActive: true },
              include: [{ model: FaqHeadings }, { model: FaqHelpStat }],
            }).then((res) => {
              result.returnCode = 1;
              result.returnMessage = "Success";
              result.data = res;
              response.json(result);
            });
          }
        )
     
      }
    })
    .catch((err) => {
      result.returnCode = -1;
      result.returnMessage = "Something went wrong!";
      response.json(result);
    });
});

router.post("/faqstat", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  FaqHelpStat.create(request.body)
    .then((res) => {
      result.returnCode = 1;
      result.returnMessage = "Success!";
      result.data = res;
      response.json(result);
    })
    .catch((error) => {
      result.returnMessage = error;
      result.returnCode = -1;
      response.json(result);
    });
});

router.put("/faqstat/:id", function (request, response) {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  FaqHelpStat.update(
    {
      Like: request.body.Like,
    },
    { where: { Id: request.params.id } }
  )
    .then((res) => {
      result.returnCode = 1;
      result.returnMessage = "Success!";
      result.data = res;
      response.json(result);
    })
    .catch((error) => {
      result.returnMessage = error;
      result.returnCode = -1;
      response.json(result);
    });
});

module.exports = router;
