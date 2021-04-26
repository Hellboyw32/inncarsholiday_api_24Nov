var express = require("express");
var path = require("path");
// var port = process.env.PORT || 6003;
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
var https = require('https');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MemoryStore = require('memorystore')(session);
var cors = require('cors');
var bodyParser = require('body-parser');
//var multer = require('multer');
// var upload = multer();



var InvoiceConfig = require("./routes/InvoiceConfig");
var testimonial = require("./routes/Testimonial");
var carpagelabel = require("./routes/carpagelabel");
var locationmetatype = require("./routes/locationmetatype");
var aboutus = require("./routes/aboutus");
var agency = require("./routes/agency");
var mainbanner = require("./routes/mainbanner");
var banners = require("./routes/banners");
var hometexts = require("./routes/hometext");
var partners = require("./routes/partners");
var sliders = require("./routes/slider")
var contactus = require("./routes/contactus");
var cartyperoutes = require("./routes/cartype");
var uploadImages = require("./routes/upload-images");
var user = require("./routes/user");
var country = require("./routes/country");
var city = require("./routes/city");
var locality = require("./routes/locality");
var carmake = require("./routes/carmake");
var carmodel = require("./routes/carmodel");
var carregistration = require("./routes/carregistartion");
var carrentalprice = require("./routes/carrentalprice");
var carrental = require("./routes/carrent");
var bookingstatus = require("./routes/bookingstatus");
var Paymentstatatus = require("./routes/paymentstatus");
var OptionalCover = require("./routes/optionalcover");
var CarOptionaCover = require("./routes/caroptionalcover");
var CarRentalOptionalCover = require("./routes/carrentaloptionalcover");
var IncludeBenefit = require("./routes/includebenefit");
var AdditionalBenefit = require("./routes/additionalbenefit");

var CoverageType = require("./routes/coverage");
var CoverageDetail = require("./routes/coverageDetails");

var ConfigChargeRate = require("./routes/ConfigChargeRate");
var Favorite = require("./routes/Favorite");
var Transaction = require("./routes/Transaction");

var Newsletter = require("./routes/Newsletter");

var TranmissionTypes = require("./routes/Transmissions");
var RateReview = require("./routes/RateReview");
var MetaData = require("./routes/MetaData");
var Deals = require("./routes/Deals");
var FooterUrldata = require("./routes/footerurl");
var vendorpayment = require("./routes/VendorPayment");
var faq = require("./routes/faq");
var fueltype = require("./routes/fueltype");
var homebanner = require("./routes/homebanner");
var seolocationdata = require("./routes/seolocationdata");
var countryconfig = require("./routes/countryconfig");
var localityFaq = require("./routes/localityfaq");
var blog_sitemap_generator = require("./routes/sitemapgenerator");

var app = express();
app.use(function (res, req, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});





app.use(cookieParser());
app.use(session({
  cookie: { maxAge: 86400000 },
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  secret: 'Shh, its a secret!'
}))
app.use(express.json({
  limit: "6mb"
}));

// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data
// app.use(upload.array()); 


app.use(cors());

//app.use(express.static(path.join(__dirname, "/dist/CarFlexi")));
app.use(express.static(path.join(__dirname, "/")));


//This is User For create The Api Path
app.use("/api/InvoiceConfig", InvoiceConfig);
app.use("/api/testimonial", testimonial);
app.use("/api/carpagelabel", carpagelabel);
app.use("/api/locationmetatype", locationmetatype);
app.use("/api/aboutus", aboutus);
app.use("/api/agency", agency);
app.use("/api/mainbanner", mainbanner);
app.use("/api/banners", banners);
app.use("/api/hometexts", hometexts);
app.use("/api/partners", partners);
app.use("/api/contactus", contactus);
app.use("/api/fueltype", fueltype);
app.use("/api/vendorpayment", vendorpayment);
app.use("/api/cartype", cartyperoutes);
app.use("/api/uploadimage", uploadImages);
app.use("/api/user", user);
app.use("/api/city", city);
app.use("/api/country", country);
app.use("/api/locality", locality);
app.use("/api/seolocationdata",seolocationdata);
app.use("/api/countryconfig",countryconfig);
app.use("/api/locality-faq",localityFaq);
app.use("/api/blog-sitemap-generator",blog_sitemap_generator)
app.use("/api/carmake", carmake);
app.use("/api/carmodel", carmodel);
app.use("/api/carregistation", carregistration);
app.use("/api/carrentalprice", carrentalprice);
app.use("/api/carrental", carrental);
app.use("/api/bookingstatus", bookingstatus);
app.use("/api/paymentstatus", Paymentstatatus);
app.use("/api/optionalcover", OptionalCover);
app.use("/api/caroptioncover", CarOptionaCover);
app.use("/api/carrentaloptionalcover", CarRentalOptionalCover);
app.use("/api/include", IncludeBenefit);
app.use("/api/additional", AdditionalBenefit);

app.use("/api/CoverageType", CoverageType);
app.use("/api/CoverageDetail", CoverageDetail);
app.use("/api/ConfigChargeRate", ConfigChargeRate);
app.use("/api/Favorite", Favorite);
app.use("/api/Transaction", Transaction);
app.use("/api/Newsletter", Newsletter);
app.use("/api/Transmission", TranmissionTypes);
app.use("/api/RateReview", RateReview);
app.use("/api/MetaData", MetaData);
app.use("/api/Deal", Deals);
app.use("/api/FooterUrldata", FooterUrldata);
app.use("/api/faq", faq);
app.use("/api/sliders", sliders);
app.use("/api/homebanner", homebanner);

//server send event
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  const timer = setInterval(() => {
    res.write('data: ping\n\n');

    res.flush();
  }, 2000);

  res.on('close', () => {
    clearInterval(timer)
  })
});

app.get('/', function (req, res) {
  res.send('Express is working on IISNode!');
});

//sending only index.html
//app.get('/', (req, res) => res.sendFile(path.join(__dirname, "/dist/CarFlexi/index.html")));
//app.get('*', (req, res) => res.sendFile(path.join(__dirname, "/dist/CarFlexi/index.html")));

app.listen(port, function () {
  console.log("App is listening on port:" + port);
});
//app.listen(process.env.PORT);



