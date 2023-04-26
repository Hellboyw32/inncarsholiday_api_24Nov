var express = require("express");

const { Agency, ContactUs, ContactRevert, CarRental, DriverDetail, CarRegistration, CarModel, CarMake, TransmissionTypes, Locality, City, CarType, CarRentalOptionalCover, OptionalCover, CarRentalPrice, LocationTypeMeta, InvoiceConfig, Country } = require("../config/database");
var router = express.Router();
var Sequelize = require("sequelize");

var handlebars = require('handlebars');
var pdf = require('html-pdf');
const nodemailer = require("nodemailer");

const smtpTransporter = require('nodemailer-smtp-transport');


const {
  smtpTransport,
  readHTMLFile,
  genUniqueId,
  pdfOptions,
  generateMailOptions,
  generateReplaceMents
} = require("../config/email-settings");

// const Op = require("sequelize").Op;
// const { google } = require("googleapis");
// const { print } = require("util");

var transporter = nodemailer.createTransport(smtpTransporter({
  name:"hostgator",
  host: "102.222.106.240",
  port: 465,
  secure: true,
  logger: true,
  requireTLS: true,
  debug: false,
  ignoreTLS: true, 
  auth: {
    user: "booking@inncarsholiday.com",
    pass: "bookMe@123Inncars"
  },
  tls: {
      rejectUnauthorized: false
  },
}));

async function generatePDFDetails(carrentalId) {
  let printableModel = {};
  await CarRental.findByPk(carrentalId, {
    include: [
      { model: DriverDetail, include: [{ model: Country }] },
      {
        model: Locality,
        as: "PickUpLocation",
        include: [
          { model: City },
          { model: LocationTypeMeta, as: "PickUpLocationMeta" },
        ],
      },
      { model: Locality, as: "DropOffLocation", include: [{ model: City }] },
      { model: CarRentalOptionalCover, include: [{ model: OptionalCover }] },
      {
        model: CarRegistration,
        include: [
          { model: Agency },
          { model: CarType },
          {
            model: CarModel,
            include: [{ model: CarMake }, { model: TransmissionTypes }],
          },
        ],
      },
    ],
  })
    .then((res) => {
      console.log(res);
      let optionalCoverCost = 0;
      printableModel.carrentalId = res.Id;
      printableModel.BookingId = res.BookingId;
      printableModel.DriverName =
        res.DriverDetail.FirstName + " " + res.DriverDetail.LastName;
      printableModel.PhoneNumber = res.DriverDetail.PhoneNumber;
      printableModel.DriverAddress = (res.DriverDetail.AddressLine1 + " " + (res.DriverDetail.AddressLine2 ? res.DriverDetail.AddressLine2 : ""));
      printableModel.DriverCountry = (res.DriverDetail.Country ? res.DriverDetail.Country.Name : null);
      printableModel.DriverFlight = res.DriverDetail.FlightNumber;
      printableModel.DriverAge = "21-35";
      printableModel.PickUpDetails =
        res.PickUpLocation.Name + ", " + res.PickUpLocation.City.Name;
      if (res.DropOffLocation) {
        printableModel.DropOffDetails =
          res.DropOffLocation.Name + ", " + res.DropOffLocation.City.Name;
      }
      printableModel.pickUpGreet =
        res.PickUpLocation.PickUpLocationMeta.ServiceDescription;
      printableModel.AmountPaid = res.AmountPaid
      printableModel.ExcessAmount = res.CarRegistration.CarType.ExcessAmount;
      printableModel.GuaranteeAmount =
        res.CarRegistration.CarType.GuaranteeAmount;
      printableModel.MinDriverAge = res.CarRegistration.CarType.MinDriverAge;
      printableModel.AgencyVoucher = res.AgencyBookingId;
      printableModel.AgencyLogoPath = res.CarRegistration.Agency.LogoPath;
      printableModel.AgencyName = res.CarRegistration.Agency.Name;
      printableModel.CarCategory = " Category: " + 
        res.CarRegistration.CarType.Name +
        ", Model: " +
        res.CarRegistration.CarModel.Name +
        " Or similar, Doors: " +
        res.CarRegistration.CarModel.Doors +
        " , with Air Conditioning, Transmission:" +
        res.CarRegistration.CarModel.TransmissionType.Name +
        ", " +
        "Capacity: " +
        res.CarRegistration.CarModel.Capacity +
        ", Big Luggage: " +
        res.CarRegistration.CarModel.BigPieceLuggage +
        ", Small Luggage: " +
        res.CarRegistration.CarModel.SmallPieceLuggage;
      if (res.IncludeCoverage) {
        printableModel.YourRentalIncludes =
          "Full Insurance Package (Check T&C) ";
      }
      printableModel.PickUpDate = "Date: " + res.BookingFrom + " Time: " + res.TimeFrom;
      printableModel.DropOffDate = "Date: " + res.BookingTo + " Time: " + res.TimeTo; 
      printableModel.DriverEmail = res.DriverDetail.Email;
      printableModel.PayableAtFront = (res.BookingAmount - res.AmountPaid).toFixed(2);
      printableModel.CarRentalCost = res.BookingAmount;
      if (
        res.CarRentalOptionalCovers &&
        res.CarRentalOptionalCovers.length > 0
      ) {
        for (i = 0; i < res.CarRentalOptionalCovers.length; i++) {
          optionalCoverCost =
            optionalCoverCost + res.CarRentalOptionalCovers[i].Amount;
          printableModel.YourRentalIncludes +=
            res.CarRentalOptionalCovers[i].OptionalCover.CoverName +
            ": " +
            res.CarRentalOptionalCovers[i].OptionalValue +
            " ";
        }
      }
      printableModel.OptionalExtrasCost = optionalCoverCost;
      printableModel.data = res;
      printableModel.returnCode = 1;
      printableModel.returnMessage = "Success";
    })
    .catch((error) => {
      console.log(error);
      printableModel.returnCode = -1;
      printableModel.returnMessage = error;
    });

  await InvoiceConfig.findAll()
    .then((res) => {
      console.log(res);
      console.log("wddw");
      printableModel.FairFuelPolicy = res[0].Text;
      printableModel.AdditionalCharge = res[1].Text;
    })
    .catch((err) => {
      console.log(err);
    });

  return printableModel;
}

router.post("/sendconfirmationinvoice/:carrentalId", (request, response) => {
  let result = { returnCode: 0, data: null, returnMessage: "" };
  readHTMLFile(
    __dirname + "../../InvoiceEmailTemplate/newsletter.html",
    function (err, html) {
      let template = handlebars.compile(html);
      generatePDFDetails(request.params.carrentalId).then((printableModel) => {
        let replacements = generateReplaceMents(printableModel);
        let htmlToSend = template(replacements);
        let finalId = genUniqueId(4) + "-" + printableModel.BookingId;
        let tempFileName = "inv_" + finalId + "_" + printableModel.AgencyVoucher + ".pdf";
        printableModel.InvoiceName = tempFileName;
        pdf
          .create(htmlToSend, pdfOptions)
          .toFile(__dirname + "../../invoicepdf/" + tempFileName, (err, res) => {
            if (err) return console.log(err);
            console.log(res);

            let mailOptions = generateMailOptions(
              printableModel.DriverEmail,
              printableModel.BookingId,
              htmlToSend,
              res
            );
            SaveInvoiceName(printableModel);
            transporter.sendMail(mailOptions, (error, res) => {
              if (error) {
                console.log(error);
                result.data = error;
                result.returnCode = -1;
                result.returnMessage = "Your email couldnt be sent!";
                response.json(result);
              } else {
                console.log("success");
                result.data = printableModel;
                result.returnCode = 1;
                result.returnMessage = "Your email has been sent!";
                response.json(result);
              }
              transporter.close();
            });
          });
      });
    }
  );
});

function SaveInvoiceName(carrentalModel){
  CarRental.update(
    {
      Invoice: carrentalModel.InvoiceName,
    },
    { where: { Id: carrentalModel.carrentalId } }
  )
    .then(() => {
      console.log("Carental updated successfully!")
    })
    .catch((error) => {
      console.log(error);
    });
}

router.post("/sendtosubscriber", function (request, response) {
  let result = { returnCode: 0, data: null, returnMessage: "" };
  console.log("Access Token", accessToken);
  const mailOptions = {
    from: "booking@inncarsholiday.com",
    to: request.body.To,
    subject: request.body.Subject,
    generateTextFromHTML: true,
    html: request.body.Html,
  };
  smtpTransport.sendMail(mailOptions, (error, res) => {
    if (error) {
      result.data = error;
      result.returnCode = -1;
      result.returnMessage = "Your email couldnt be sent!";
      response.json(result);
    } else {
      result.data = res;
      result.returnCode = 1;
      result.returnMessage = "Your email has been sent!";
      response.json(result);
    }
    smtpTransport.close();
  });
});
// info@mauriconnect.com
router.post("/sendRevert", function (request, response) {
  let result = { returnCode: 0, data: null, returnMessage: "" };
  const mailOptions = {
    from: "booking@inncarsholiday.com",
    to: request.body.To,
    subject: request.body.Subject,
    cc: ["info@mauriconnect.com", "booking@inncarsholiday.com"],
    text: request.body.Message,
  };
  smtpTransport.sendMail(mailOptions, (error, res) => {
    if (error) {
      result.returnCode = -1;
      result.returnMessage = "Your email couldnt be sent!";
    } else {
      ContactRevert.create(request.body)
        .then(() => {
          result.returnCode = 1;
          result.data = true;
          result.returnMessage = "Your message was successfully sent!";
        })
        .catch(() => {
          result.returnCode = -1;
          result.data = false;
          result.returnMessage = "Something went wrong!";
        })
        .finally(() => {
          response.json(result);
        });
    }
    smtpTransport.close();
  });
});

router.post("/postcontact", function (request, response) {
  let result = { returnCode: 0, data: null, returnMessage: "" };
  const mailOptions = {
    from: "booking@inncarsholiday.com",
    to: "booking@inncarsholiday.com",
    subject: "Customer Enquiry From: " + request.body.Email,
    cc: ["info@mauriconnect.com", "booking@inncarsholiday.com",request.body.Email],
    text: request.body.Message,
  };
  ContactUs.create(request.body)
    .then(() => {
      smtpTransport.sendMail(mailOptions, (error, res) => {
        if (error) {
          console.log(error);
        } else {
          result.returnCode = 1;
          result.data = true;
          result.returnMessage = "Your message was successfully sent!";
          response.json(result);
        }
        smtpTransport.close();
      });
    })
    .catch(() => {
      result.returnCode = -1;
      result.data = false;
      result.returnMessage = "Something went wrong!";
      response.json(result);
    })
});

router.get("/getpagedcontactus/:page/:pageSize", function (request, response) {
  let limit = +request.params.pageSize;
  let offset = (+request.params.page - 1) * +request.params.pageSize;
  let result = { returnCode: 0, data: null, returnMessage: "", count: 0 };
  ContactUs.findAndCountAll({
    where: { IsActive: true },
    order: [["SentOn", "DESC"]],
    include: [{ model: ContactRevert }],
    limit,
    offset,
  })
    .then((data) => {
      result.count = data.count;
      result.data = data.rows;
      result.returnCode = 1;
      result.returnMessage = "Query success!";
    })
    .catch((error) => {
      result.returnCode = -1;
      result.returnMessage = error;
    })
    .finally(() => response.json(result));
});

router.delete("/deletemessage/:messageId", function (request, response) {
  let result = { returnCode: 0, data: null, returnMessage: "" };
  ContactUs.update({ IsActive: false }, { where: { Id: request.params.messageId } })
    .then(() => {
      result.returnCode = 1;
      result.data = true;
      result.returnMessage = "Message has been deleted!";
    })
    .catch(() => {
      result.returnCode = -1;
      result.data = false;
      result.returnMessage = "Something went wrong!";
    })
    .finally(() => {
      response.json(result);
    });
});


module.exports = router;
