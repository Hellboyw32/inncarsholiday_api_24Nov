var express = require("express");
const {
  sequelize,
  City,
  Locality,
  LocationTypeMeta,
  CarCity,
  CarRentalPrice,
  CarRegistration,
  CarType,
  TransmissionTypes,
  LocalityFaq,
} = require("../config/database");
var router = express.Router();
const Sequelize = require("sequelize");
const Op = require("sequelize").Op;
const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const graphQlendPoint = "https://blog.inncarsholiday.com";
router.get("/typeswithminprices/:locationId", (req, res) => {
  let result = {};
  CarRentalPrice.findAll({
    where: { IsActive: true },
    include: [
      {
        model: CarRegistration,
        required: true,
        include: [
          {
            model: CarCity,
            required: true,
            include: [
              {
                model: City,
                required: true,
                where: {
                  IsActive: true,
                },
                include: [
                  {
                    model: Locality,
                    required: true,
                    where: {
                      Id: +req.params.locationId,
                      IsActive: true,
                    },
                  },
                ],
              },
            ],
          },
          {
            model: CarType,
            where: {
              IsActive: true,
            },
            required: true,
            include: [
              {
                model: TransmissionTypes,
              },
            ],
          },
        ],
      },
    ],
    attributes: [[Sequelize.fn("min", Sequelize.col("Price")), "Price"]],
    group: ["CarRegistration.CarTypeId"],
    raw: true,
    nest: true,
  })
    .then((cartype) => {
      if (cartype != null) {
        result.returnCode = 1;
        result.data = cartype;
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

//all pickup locations
router.get(
  "/allpickuplocations/:country/:language",
  function (request, response) {
    let result = {};
    console.log("allpickuplocations===================", request.params);
    Locality.findAll({
      attributes: ["Id", "Name", "Surcharge", "TypeId", "Lat", "Long"],
      where: {
        IsActive: true,
        IsPickUp: true,
        CountryCode: request.params.country,
        Language: request.params.language,
      },
      include: [{ model: City, attributes: ["Id", "Name"] }],
      order: [["Name", "ASC"]],
    })
      .then((data) => {
        result.data = data;
        result.responseCode = 1;
      })
      .catch(() => {
        result.data = null;
        result.responseCode = -1;
      })
      .finally(() => response.json(result));
  }
);

//locality by slug
router.post("/localitybyslug", function (request, response) {
  console.log("==========================slug", request.body);
  let result = {};
  Locality.findAll({
    attributes: [
      "Id",
      "Name",
      "Surcharge",
      "TypeId",
      "Lat",
      "Long",
      "Slug",
      "Description",
      "heading_h1",
      "Heading_sub_text",
    ],
    where: {
      Slug: request.body.slug,
      CountryCode: request.body.country,
      Language: request.body.language,
      IsActive: true,
      IsPickUp: true,
    },
    include: [
      { model: City, attributes: ["Id", "Name"] },
      { model: LocalityFaq, where: { Status: "active" }, required: false },
    ],
    order: [["Name", "ASC"]],
  })
    .then((data) => {
      result.data = data;
      result.responseCode = 1;
    })
    .catch(() => {
      result.data = null;
      result.responseCode = -1;
    })
    .finally(() => response.json(result));
});

//all dropoff locations
router.get(
  "/alldropofflocations/:country/:language",
  function (request, response) {
    console.log("alldropofflocations===================", request.params);
    let result = {};
    Locality.findAll({
      attributes: ["Id", "Name", "Surcharge", "TypeId"],
      where: {
        IsActive: true,
        IsDropOff: true,
        CountryCode: request.params.country,
        Language: request.params.language,
      },
      include: [{ model: City, attributes: ["Id", "Name"] }],
      order: [["Name", "ASC"]],
    })
      .then((data) => {
        result.data = data;
        result.responseCode = 1;
      })
      .catch(() => {
        result.data = null;
        result.responseCode = -1;
      })
      .finally(() => response.json(result));
  }
);

//all cities by paging
router.get("/paging/all", function (request, response) {
  let pageSize = request.query.page_size;
  let page = request.query.page;
  let CountryCode = request.query.CountryCode;
  let Language = request.query.Language;
  let whereClause = {};
  CountryCode ? (whereClause.CountryCode = CountryCode) : "";
  Language ? (whereClause.Language = Language) : "";
  whereClause.IsActive = true;

  var result = { returnCode: 0, count: 0, data: null, returnMessage: "" };
  Locality.findAndCountAll({
    where: whereClause,
    include: [{ model: City }],
    order: [["Name"]],
  })
    .then((locality) => {
      result.count = locality.rows.length;
      result.data = locality.rows.slice((page - 1) * pageSize, page * pageSize);
      result.returnCode = 0;
      result.returnMessage = "Success";
      response.json(result);
    })
    .catch((error) => {
      result.returnCode = -1;
      result.returnMessage = "Server Error";
      response.json(result);
      return;
    });
});

//all cities
router.get("/", function (request, response) {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: "",
  };
  Locality.findAll({
    where: { IsActive: true },
    include: [
      {
        model: City,
      },
    ],
  })
    .then((locality) => {
      result.data = locality;
      result.returnMessage = "Success";
      response.json(result);
      return;
    })
    .catch((error) => {
      result.returnCode = -1;
      result.returnMessage = "Server Error";
      response.json(result);
      return;
    });
});

//Get top destination
router.get("/topdestination/:CountryCode/:Language", (_req, _res) => {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  console.log("topdestination===================", _req.params);
  Locality.findAll({
    where: {
      IsTopDestination: true,
      IsActive: true,
      CountryCode: _req.params.CountryCode,
      Language: _req.params.Language,
    },
    order: ["Name"],
  })
    .then((data) => {
      result.data = data;
      _res.json(result);
    })
    .catch((err) => {
      _res.send(err);
    });
});

//get popular destination
//Get locality by name
router.get("/populardestination/:CountryCode/:Language", (_req, _res) => {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  Locality.findAll({
    where: {
      IsPopularDestination: true,
      IsActive: true,
      CountryCode: _req.params.CountryCode,
      Language: _req.params.Language,
    },
    order: ["Name"],
  })
    .then((data) => {
      result.data = data;
      _res.json(result);
    })
    .catch((err) => {
      _res.send(err);
    });
});

//Get locality by name
router.get("/byname", (_req, _res) => {
  var result = { returnCode: 0, data: null, returnMessage: "" };
  Locality.findAll({
    where: { Name: { [Op.like]: "" + _req.query.name + "%" } },
  })
    .then((data) => {
      result.data = data;
      _res.json(result);
    })
    .catch((err) => {
      _res.send(err);
    });
});

//get locality by cityId

router.get("/cityId/:id", (_req, _res) => {
  Locality.findAll({
    where: {
      cityId: _req.params.id,
    },
    include: [
      {
        model: City,
      },
    ],
    order: [["Name", "ASC"]],
  })
    .then((data) => {
      _res.json(data);
    })
    .catch((err) => {
      _res.send(err);
    });
});

router.get("/cities", (_req, _res) => {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: "",
  };
  Locality.findAll({
    where: {
      cityId: _req.query.cities.split(","),
    },
    order: [["Name", "ASC"]],
  })
    .then((data) => {
      result.data = data;
      _res.json(result);
    })
    .catch((err) => {});
});

// Add city
router.post("/create", function (request, response) {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: "",
  };
  Locality.create(request.body, {
    include: [
      {
        model: City,
      },
    ],
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
router.post("/update/:id", function (request, response) {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: "",
  };
  Locality.findByPk(request.params.id)
    .then((data) => {
      if (data != null) {
        data.Name = request.body.Name;
        data.Surcharge = +request.body.Surcharge;
        data.IsPickUp = request.body.IsPickUp;
        data.IsDropOff = request.body.IsDropOff;
        data.CityId = +request.body.CityId;
        data.IsTopDestination = request.body.IsTopDestination;
        data.IsPopularDestination = request.body.IsPopularDestination;
        data.TypeId = request.body.TypeId;
        data.PickUpMetaId = request.body.PickUpMetaId;
        data.DropoffMetaId = request.body.DropoffMetaId;
        data.Long = request.body.Long;
        data.Lat = request.body.Lat;
        data.Address = request.body.Address;
        data.heading_h1 = request.body.heading_h1;
        data.Heading_sub_text = request.body.Heading_sub_text;
        data.Description = request.body.Description;
        data.Slug = request.body.Slug;
        data.CountryCode = request.body.CountryCode;
        data.Language = request.body.Language;
        data.save().then(() => {
          result.data = data;
          result.returnMessage = "Success";
          response.json(result);
        });
      } else {
        result.returnCode = -1;
        result.returnMessage = "city not found";
        response.json(result);
      }
    })
    .catch((err) => {
      response.send(err);
    });
});
//delete location
router.post("/delete/:id", function (request, response) {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: "",
  };
  Locality.findByPk(request.params.id)
    .then((data) => {
      if (data != null) {
        data.IsActive = false;
        data.save().then(() => {
          result.data = true;
          result.returnMessage = "Success";
          response.json(result);
        });
      }
    })
    .catch((err) => {
      result.returnCode = -1;
      result.returnMessage = "Server Error";
      response.json(result);
    });
});

router.get("/getby/locality", (_req, _res) => {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: "",
  };
  Locality.findAll({
    where: {
      Id: _req.query.localityId.split(","),
    },
  })
    .then((data) => {
      result.data = data;
      _res.json(result);
    })
    .catch((err) => {
      _res.send(err);
      //return basicOperations.MakeErrorResultObject(basicOperations.StatusCodes.CODE404, null, basicOperations.STRINGS.SERVER_ERROR);
    });
});
// CarRental.sequelize
// .query(
//   query,
//   { type: Sequelize.QueryTypes.SELECT }
// )
router.get("/gettypesbylocation/:locationId", (request, response) => {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: "",
  };
  var query =
    "SELECT ct.*, tt.Name as TransmissionTypeName from cartype as ct left join transmissiontypes as tt on ct.TransmissionTypeId = tt.Id  where ct.Id IN (SELECT CarTypeId FROM carregistration WHERE Id IN (SELECT CarRegistrationId FROM carcity WHERE CityId IN (SELECT CityId FROM locality WHERE Id = :esclocality)));";
  Locality.sequelize
    .query(query, {
      replacements: { esclocality: +request.params.locationId },
      type: Sequelize.QueryTypes.SELECT,
    })
    .then((res) => {
      if (res != null) {
        result.data = res;
        result.returnCode = 1;
        result.returnMessage = "successfull";
        response.json(result);
      }
    })
    .catch((err) => {
      response.send(err);
    });
});

//delete location
router.post("/blogseo", function (request, response) {
  console.log("body::::", request.body);
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: "",
  };

  //console.log("slug",slug)
  let graphQlendPoint = "https://blog.inncarsholiday.com/graphql";
  //console.log("slug",slug)
  let payload = {
    query: `{posts(where: {id:${request.body.id}}) {
      edges {
        node {
          id
          title
          seo {
            canonical
            title
            metaDesc
            metaKeywords
            metaRobotsNoindex
            metaRobotsNofollow
            opengraphAuthor
            opengraphType
            opengraphDescription
            opengraphTitle
            opengraphDescription
            opengraphImage {
              altText
              sourceUrl
              srcSet
            }
            opengraphUrl
            opengraphSiteName
            twitterTitle
            twitterDescription
            twitterImage {
              altText
              sourceUrl
              srcSet
            }
            breadcrumbs {
              url
              text
            }
            cornerstone
            schema {
              pageType
              articleType
              raw
            }
          }
        }
      }
    }}  
    `,
  };

  console.log("body::::", payload);

  axios
    .post(`${graphQlendPoint}`, payload)
    .then((data) => {
      //if (response != null) {
      console.log("data graphql::::", data.data);
      //response.json(data.data);

      result.data = data.data;
      result.returnCode = 1;
      result.returnMessage = "successfull";
      response.json(result);

      //}
    })
    .catch((err) => {
      console.log("blog graphql error::::", err);
      response.send(err);
    });
});

// all blogs
router.get("/posts", (request, response) => {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: "",
  };

  console.log("data posts::::");

  let per_page = request.query.per_page ? request.query.per_page : "0";
  let offset = request.query.offset ? request.query.offset : "0";
  axios
    .get(
      `${graphQlendPoint}/wp-json/wp/V2/posts/?per_page=${per_page}&offset=${offset}`
    )
    .then((data) => {
      //if (response != null) {
      //console.log("data posts::::",data);
      //response.json(data.data);

      result.data = data.data;
      result.returnCode = 1;
      result.returnMessage = "successfull";
      response.json(result);

      //}
    })
    .catch((err) => {
      console.log("blog posts error::::", err);
      response.send(err);
    });
});

// single post

router.post("/postBySlug", (request, response) => {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: "",
  };

  //console.log("data posts::::");
  let slug = request.body.slug ? request.body.slug : "asasasasasasasasasasasas";
  axios
    .get(`${graphQlendPoint}/wp-json/wp/V2/posts/?slug=${slug}`)
    .then((data) => {
      //if (response != null) {
      // console.log("data posts::::",data.data[0]);
      //

      // <p>Hello world</p>
      //   <p>Suggested Read 1: <a href="./things-to-do-in-mauritius/">Top 14 Things to do in Mauritius for Fulfilled Vacation</a></p>
      //   <p>Suggested Read 2: <a href="./things-to-do-in-mauritius/">Top 14 Things to do in Mauritius for Fulfilled Vacation</a></p>
      //   <p>Suggested Read 3: <a href="./things-to-do-in-mauritius/">Top 14 Things to do in Mauritius for Fulfilled Vacation</a></p>
      //   <p>Suggested Read 4: <a href="./things-to-do-in-mauritius/">Top 14 Things to do in Mauritius for Fulfilled Vacation</a></p>
      const dom = new JSDOM(`${data.data[0].content.rendered}`);

      let content = dom.window.document.querySelectorAll("a");
      let uurl =
        `${request.body.basePath}/${request.body.country}/${request.body.language}/blog/abcd`.split(
          "/"
        );
      content.forEach((element, index) => {
        let attribute = content[index]
          .getAttribute("href")
          .replace("/", "")
          .replace("/", "")
          .replace(".", "");
        uurl[uurl.length - 1] = attribute;
        content[index].setAttribute("href", uurl.join("/"));
        //console.log("dom=============================",uurl.join('/'),uurl); // "Hello world"
      });
      console.log(
        "dom all=============================",
        dom.window.document.body.innerHTML
      ); // "Hello world"
      data.data[0].content.rendered = dom.window.document.body.innerHTML;

      //response.json(data.data);
      result.data = data.data;
      result.returnCode = 1;
      result.returnMessage = "successfull";
      response.json(result);
      //}
    })
    .catch((err) => {
      //console.log("blog posts error::::",err)
      response.send(err);
    });
});

// blog media
router.get("/media/:id", (request, response) => {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: "",
  };

  console.log("data media::::");

  let media_id = request.params.id ? request.params.id : "2312321321321321";
  axios
    .get(`${graphQlendPoint}/wp-json/wp/V2/media/${media_id}`)
    .then((data) => {
      //if (response != null) {
      console.log("data media::::", data);
      //response.json(data.data);

      result.data = data.data;
      result.returnCode = 1;
      result.returnMessage = "successfull";
      response.json(result);

      //}
    })
    .catch((err) => {
      console.log("blog media error::::", err);
      response.send(err);
    });
});

// Get locality By Id

router.get("/:id/:lang?", function (request, response) {
  var result = {
    returnCode: 0,
    data: null,
    returnMessage: "",
  };
  let langParameters = [
    "Id",
    "MetaIDTag",
    "TypeId",
    "ServiceLabel",
    "ServiceDescription",
    "TimingLabel",
    "TimingDescription",
    "Instructions",
  ];
  if (request.params.lang && request.params.lang == "french")
    langParameters = [
      "Id",
      "MetaIDTag",
      "TypeId",
      ["ServiceLabelFrench", "ServiceLabel"],
      ["ServiceDescriptionFrench", "ServiceDescription"],
      ["TimingLabelFrench", "TimingLabel"],
      ["TimingDescriptionFrench", "TimingDescription"],
      ["InstructionsFrench", "Instructions"],
    ];
  Locality.findByPk(request.params.id, {
    include: [
      { model: City },
      {
        model: LocationTypeMeta,
        as: "PickUpLocationMeta",
        attributes: langParameters,
      },
      {
        model: LocationTypeMeta,
        as: "DropOffLocationMeta",
        attributes: langParameters,
      },
    ],
  })
    .then((loclity) => {
      if (loclity != null) {
        result.returnCode = 1;
        result.returnMessage = "success";
        result.data = loclity;
      } else {
        result.returnMessage = "Location not found";
      }
      response.json(result);
    })
    .catch((err) => {
      console.log(err);
      result.returnCode = -1;
      result.returnMessage = "server error";
      response.json(result);
    });
});
module.exports = router;
