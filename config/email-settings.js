const nodemailer = require("nodemailer");
const fs = require("fs");
const transport = require('nodemailer-smtp-transport');

const smtpTransport = nodemailer.createTransport(transport({
   name:"hostgator",
    host: "mail.mauriconnect.com",
    port: 465,
    secure: true,
    logger: true,
    requireTLS: true,
    debug: false,
    ignoreTLS: true, 
    auth: {
      user: "booking-inncarholidays@mauriconnect.com",
      pass: "gatorbooking32$"
    },
    tls: {
        rejectUnauthorized: false
    },
}));
const readHTMLFile = function (path, callback) {
  fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
    if (err) {
      throw err;
      callback(err);
    } else {
      callback(null, html);
    }
  });
};

const genUniqueId = function generateId(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
// format: "A4",
// border: "30",
// header: {
//   height: "25mm",
// },
// footer: {
//   height: "35mm",
// },
const pdfOptions = {
  "format": "A4",
  "zoomFactor":"0.5",
  "timeout": '300000000', 
  // "viewportSize": {
  // width: 500,
  // height: 600
  // },
  "border": {
    "top": "0.5in",            // default is 0, units: mm, cm, in, px
    "right": "1in",
    "bottom": "0.5in",
    "left": "1.1in"     
  },
//   "header": {
//   "height": "1in",
// },
// "footer": {
//   "height": "0in",
// },  
};

// C:\\Users\\Warsaw\\Documents\\VS_Repos\\CarRental\\car_rental\\invoicepdf\\inv_9QMj-MC5125133_TAG5454A188.pdf
const generateMailOptions = function (To, BookingId, htmlToSend, invoicePath) {
    console.log("invoicePath", invoicePath);
    invSplit = invoicePath.filename.split("//");
  return (mailOptions = {
    from: "booking-inncarholidays@mauriconnect.com",
    to: To,
    cc: ["info@mauriconnect.com", "booking-inncarholidays@mauriconnect.com"],
    subject: "Your booking confirmation: " + BookingId,
    generateTextFromHTML: true,
    html: htmlToSend,
    attachments: [
      {
        filename: "OrderInvoice.pdf",
        path: invoicePath.filename,
        cid: "invoicepdf",
      },
    ],
  });
};

const generateReplaceMents = function (printableModel) {
  return (replacements = {
    title: "EJS",
    text: "Hello world",
    DriverName: printableModel.DriverName,
    PhoneNumber: printableModel.PhoneNumber,
    DriverAge: printableModel.DriverAge,
    PickUpDetails: printableModel.PickUpDetails,
    DropOffDetails: printableModel.DropOffDetails,
    CarCategory: printableModel.CarCategory,
    YourRentalIncludes: printableModel.YourRentalIncludes,
    RentalDays: printableModel.RentalDates,
    OptionalExtrasCost: printableModel.OptionalExtrasCost,
    CarRentalCost: printableModel.CarRentalCost,
    PayableAtFront: printableModel.PayableAtFront,
    BookingId: printableModel.BookingId,
    AgencyVoucher: printableModel.AgencyVoucher,
    AgencyName: printableModel.AgencyName,
    ExcessAmount: printableModel.ExcessAmount,
    GuaranteeAmount: printableModel.GuaranteeAmount,
    MinDriverAge: printableModel.MinDriverAge,
    PickUpDecription: printableModel.pickUpGreet,
    InnCarLogo: "http://131.153.58.69:3000/assets/img/logo.png",
    AgencyLogo: "http://131.153.58.69:3000/" + printableModel.AgencyLogoPath,
    FarFuelPolicy: printableModel.FairFuelPolicy,
    AdditionalCharge: printableModel.AdditionalCharge,
    PickUpDate: printableModel.PickUpDate,
    DropOffDate: printableModel.DropOffDate, 
    DriverAddress: printableModel.DriverAddress,
    DriverCountry: printableModel.DriverCountry,
    DriverFlight: printableModel.DriverFlight,
    AmountPaid: printableModel.AmountPaid
  });
};

module.exports = {
  smtpTransport,
  readHTMLFile,
  genUniqueId,
  pdfOptions,
  generateMailOptions,
  generateReplaceMents
};
