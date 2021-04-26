const globalObj = require("./db/global/global-import");
const sequelize = globalObj.sequelize;
const Sequelize = globalObj.Sequelize;

//Tables
const FaqHelpStat = require("./db/models/faqhelpstat");
const InvoiceConfig = require("./db/models/invoiceconfig");
const Testimonial = require("./db/models/testimonial");
const CarRegistrationLabel = require("./db/models/carregistrationlabel");
const CarPageLabel = require("./db/models/carpagelabel");
const LocationTypeMeta = require("./db/models/locationtypemeta");
const AboutUsText = require("./db/models/aboutustext");
const AboutUsPicture = require("./db/models/aboutuspicture");
const HomeBanner = require("./db/models/homebanner");
const Banners = require("./db/models/banners");
const HomeTexts = require("./db/models/hometexts");
const MainBanner = require("./db/models/mainbanner");
const Partners = require("./db/models/partners")
const Sliders = require("./db/models/sliders");
const ContactRevert = require("./db/models/contactrevert");
const ContactUs = require("./db/models/contactus");
const CarType = require("./db/models/car-type");
const Role = require("./db/models/role");
const User = require("./db/models/user");
const UserProfile = require("./db/models/user-profile");
const AgencyProfile = require("./db/models/agency-profile");
const Agency = require("./db/models/agency");
const Country = require("./db/models/country");
const City = require("./db/models/city");
const Locality = require("./db/models/locality");
const CarMake = require("./db/models/carmake");
const CarModel = require("./db/models/carmodel");
const CarRegistration = require("./db/models/carregistration");
const CarRentalPrice = require("./db/models/carrentalprice");
const CarRental = require("./db/models/carrental");
const PaymentStatus = require("./db/models/paymentstatus");
const BookingStatus = require("./db/models/bookingstatus");
const DriverDetail = require("./db/models/driverdetail");
const OptionalCover = require("./db/models/optinalcover");
const CarOptionalCover = require("./db/models/caroptionalcover");
const CarRentalOptionalCover = require("./db/models/carrentaloptionalcover");
const InculdeBenefit = require("./db/models/includebenefit");
const AdditionalBenefit = require("./db/models/additionalbenefit");
const CarInclude = require("./db/models/carincludes");
const CarAdditionalInclude = require("./db/models/caradditionalinclude");
const CarCity = require("./db/models/carcity");

const CoverageType = require("./db/models/CoverageType");
const CoverageDetail = require("./db/models/CoverageDetail");

const ConfigChargeRate = require("./db/models/config-charge");

const Favorite = require("./db/models/Favorite");
const Transaction = require("./db/models/Transaction");

const Newsletter = require("./db/models/Newsletter");
const RateReview = require("./db/models/RateReview");
const TransmissionTypes = require("./db/models/TransmissionTypes");
const BookedPercentage = require("./db/models/BookedPercentage");
const CarBookingStats = require("./db/models/CarBookingStats");
const MetaData = require("./db/models/MetaData");
const MetaPages = require("./db/models/MetaPages");
const Deal = require("./db/models/Deal");
const DealSummery = require("./db/models/DealSummery");
const Template = require("./db/models/template");
const FooterUrldata = require("./db/models/FooterUrlData");
const FooterUrl = require("./db/models/FooterUrl");
const FooterHeader = require("./db/models/FooterHeader");
const VendorPayment = require("./db/models/VendorPayment");
const VendorPaymentSummary = require("./db/models/VendorPaymentSummary");
const FaqHeadings = require("./db/models/faqheadings");
const FaqQna = require("./db/models/faqqna");
const fueltype = require("./db/models/fueltype");
const MetaTag = require ("./db/models/metatag");
const Scripts = require("./db/models/scripts");
const SeoLocationData = require("./db/models/seolocationdata");
const CountryConfig = require("./db/models/countryconfig");
const LocalityFaq = require("./db/models/localityfaqs");

Country.hasMany(DriverDetail, {
  foreignKey: "CountryId",
  targetKey: "Id",
}); 

DriverDetail.belongsTo(Country, {
  foreignKey: "CountryId",
  targetKey: "Id",
});
CarRegistration.belongsTo(CoverageType, {
  foreignKey: "InsuranceTypeId",
  targetKey: "Id",
});

CoverageType.hasMany(CarRegistration, {
  foreignKey: "InsuranceTypeId",
  targetKey: "Id",
});
FaqHelpStat.belongsTo(FaqQna,{
  foreignKey: "QnaId",
  targetKey: "Id",  
});

FaqQna.hasMany(FaqHelpStat,{
  foreignKey: "QnaId",
  targetKey: "Id",  
});

LocalityFaq.belongsTo(Locality, {
  foreignKey: "LocalityId",
  targetKey: "Id",
});

Locality.hasMany(LocalityFaq, {
  foreignKey: "LocalityId",
  targetKey: "Id",
});

Locality.belongsTo(City, {
  foreignKey: "CityId",
  targetKey: "Id",
});

City.hasMany(Locality, {
  foreignKey: "CityId",
  targetKey: "Id",
});

Locality.belongsTo(LocationTypeMeta, {
  as: "PickUpLocationMeta",
  foreignKey: "PickUpMetaId",
  targetKey: "Id",
});
Locality.belongsTo(LocationTypeMeta, {
  as: "DropOffLocationMeta",
  foreignKey: "DropoffMetaId",
  targetKey: "Id",
});

LocationTypeMeta.hasMany(Locality, {
  foreignKey: "PickUpMetaId",
  targetKey: "Id",
});

LocationTypeMeta.hasMany(Locality, {
  foreignKey: "DropoffMetaId",
  targetKey: "Id",
});

  CarRegistrationLabel.belongsTo(CarRegistration, {
    foreignKey: "CarRegistrationId",
    targetKey: "Id",
  });

  CarRegistration.hasMany(CarRegistrationLabel, {
    foreignKey: "CarRegistrationId",
    targetKey: "Id",
  });

  CarRegistrationLabel.belongsTo(CarPageLabel, {
    foreignKey: "CarPageLabelId",
    targetKey: "Id",
  });

  CarPageLabel.hasMany(CarRegistrationLabel, {
    foreignKey: "CarPageLabelId",
    targetKey: "Id",
  });


ContactUs.hasMany(ContactRevert, {
  foreignKey: "ContactUsId",
  targetKey: "Id"
})

ContactRevert.belongsTo(ContactUs, {
  foreignKey: "ContactUsId",
  targetKey: "Id"
})

fueltype.hasMany(CarRegistration, {
  foreignKey: "FuelTypeId",
  targetKey: "Id"
});

CarRegistration.belongsTo(fueltype, {
  foreignKey: "FuelTypeId",
  targetKey: "Id"
})

FaqHeadings.hasMany(FaqQna, {
  foreignKey: "HeadingId",
  targetKey: "Id",
});

FaqQna.belongsTo(FaqHeadings, {
  foreignKey: "HeadingId",
  targetKey: "Id",
});

CarRental.hasOne(VendorPayment, {
  foreignKey: "CarRentalId",
  targetKey: "Id",
});

VendorPayment.belongsTo(CarRental, {
  foreignKey: "CarRentalId",
  targetKey: "Id",
});

VendorPayment.hasOne(VendorPaymentSummary, {
  foreignKey: "VendorPaymentId",
  targetKey: "Id",
});

VendorPaymentSummary.belongsTo(VendorPayment, {
  foreignKey: "VendorPaymentId",
  targetKey: "Id",
});

PaymentStatus.hasOne(VendorPaymentSummary, {
  foreignKey: "PaymentStatusId",
  targetKey: "Id",
});

VendorPaymentSummary.belongsTo(PaymentStatus, {
  foreignKey: "VendorPaymentId",
  targetKey: "Id",
});

FooterUrl.hasOne(FooterUrldata, {
  foreignKey: "FooterUrlId",
  targetKey: "Id",
});

FooterUrldata.belongsTo(FooterUrl, {
  foreignKey: "FooterUrlId",
  targetKey: "Id",
});

FooterUrl.belongsTo(FooterHeader, {
  foreignKey: "FooterHeaderId",
  targetKey: "Id",
});

FooterHeader.hasMany(FooterUrl, {
  foreignKey: "FooterHeaderId",
  targetKey: "Id",
});

//User Association
User.hasOne(UserProfile, {
  foreignKey: "UserId",
  targetKey: "Id",
});

UserProfile.belongsTo(User, {
  foreignKey: "UserId",
  targetKey: "Id",
});
Role.hasMany(User, {
  foreignKey: "RoleId",
  targetKey: "Id",
});

User.belongsTo(Role, {
  foreignKey: "RoleId",
  targetKey: "Id",
});



// User.hasOne(AgencyProfile, {
//   foreignKey: "UserId",
//   targetKey: "Id",
// });

// AgencyProfile.belongsTo(User, {
//   foreignKey: "UserId",
//   targetKey: "Id",
// });

//Association in Coverage and Coverage details
CoverageType.hasMany(CoverageDetail, {
  foreignKey: "CoverageTypeId",
  targetKey: "Id",
});

CoverageDetail.belongsTo(CoverageType, {
  foreignKey: "CoverageTypeId",
  targetKey: "Id",
});
Agency.hasMany(RateReview, {
  foreignKey: "VendorId",
  targetKey: "Id",
});
RateReview.belongsTo(Agency, {
  foreignKey: "VendorId",
  targetKey: "Id",
});

City.hasMany(Agency, {
  foreignKey: "CityId",
  targetKey: "Id",
});
Agency.belongsTo(City, {
  foreignKey: "CityId",
  targetKey: "Id",
});
//Association in city country and locality
Country.hasMany(City, {
  foreignKey: "CountryId",
  targetKey: "Id",
}); 

City.belongsTo(Country, {
  foreignKey: "CountryId",
  targetKey: "Id",
});

City.hasMany(Locality, {
  foreignKey: "CityId",
  targetKey: "Id",
});
Locality.belongsTo(City, {
  foreignKey: "CityId",
  targetKey: "Id",
});

//Meta tags

MetaPages.hasMany(MetaData, {
  foreignKey: "PageId",
  targetKey: "Id",
});
MetaData.belongsTo(MetaPages, {
  foreignKey: "PageId",
  targetKey: "Id",
});

MetaTag.hasMany(MetaData, {
  foreignKey: "TagId",
  targetKey: "Id",
});
MetaData.belongsTo(MetaTag, {
  foreignKey: "TagId",
  targetKey: "Id",
});

//Carmake And CarModel

CarMake.hasMany(CarModel, {
  foreignKey: "CarMakeId",
  targetKey: "Id",
});
CarModel.belongsTo(CarMake, {
  foreignKey: "CarMakeId",
  targetKey: "Id",
});

//Transmission type
TransmissionTypes.hasMany(CarModel, {
  foreignKey: "TransmissionTypeId",
  targetKey: "Id",
});

CarModel.belongsTo(TransmissionTypes, {
  foreignKey: "TransmissionTypeId",
  targetKey: "Id",
});

TransmissionTypes.hasMany(CarType, {
  foreignKey: "TransmissionTypeId",
  targetKey: "Id",
});

CarType.belongsTo(TransmissionTypes, {
  foreignKey: "TransmissionTypeId",
  targetKey: "Id",
});

//CarRegistration
CarType.hasMany(CarRegistration, {
  foreignKey: "CarTypeId",
  targetKey: "Id",
});
CarRegistration.belongsTo(CarType, {
  foreignKey: "CarTypeId",
  targetKey: "Id",
});

CarModel.hasMany(CarRegistration, {
  foreignKey: "CarModelId",
  targetKey: "Id",
});

CarRegistration.belongsTo(CarModel, {
  foreignKey: "CarModelId",
  targetKey: "Id",
});

Agency.hasMany(CarRegistration, {
  foreignKey: "VenderId",
  targetKey: "Id",
});
CarRegistration.belongsTo(Agency, {
  foreignKey: "VenderId",
  targetKey: "Id",
});
Agency.hasMany(CarRental, {
  foreignKey: "AgencyId",
  targetKey: "Id",
});
CarRental.belongsTo(Agency, {
  foreignKey: "AgencyId",
  targetKey: "Id",
});


CarRentalPrice.hasOne(CarRental, {
  foreignKey: "CarRentalPriceId",
  targetKey: "Id"
});

CarRental.belongsTo(CarRentalPrice, {
  foreignKey: "CarRentalPriceId",
  targetKey: "Id",
});

CarRegistration.hasMany(CarRentalPrice, {
  foreignKey: "CarRegistrationId",
  targetKey: "Id",
  as: "CarRentalPrices"
});

CarRegistration.hasOne(CarRentalPrice, {
  foreignKey: "CarRegistrationId",
  targetKey: "Id",
  as: "CarRentalPrice"
});

CarRentalPrice.belongsTo(CarRegistration, {
  foreignKey: "CarRegistrationId",
  targetKey: "Id",
});

CarRental.belongsTo(Locality, {
  as: 'PickUpLocation',
  foreignKey: "PickUpLocationId",
  targetKey: "Id",
});

CarRental.belongsTo(Locality, {
  as: 'DropOffLocation',
  foreignKey: "DropOffLocationId",
  targetKey: "Id",
});
Locality.hasOne(CarRental, {
  foreignKey: "PickUpLocationId",
  targetKey: "Id",
});
Locality.hasOne(CarRental, {
  foreignKey: "DropOffLocationId",
  targetKey: "Id",
});

CarRental.belongsTo(User, {
  foreignKey: "BookedById",
  targetKey: "Id",
});

User.hasMany(CarRental, {
  foreignKey: "BookedById",
  targetKey: "Id",
});

CarRental.belongsTo(CarRegistration, {
  foreignKey: "CarRegistrationId",
  targetKey: "Id",
});

CarRegistration.hasOne(CarRental, {
  foreignKey: "CarRegistrationId",
  targetKey: "Id",
});

CarRental.belongsTo(PaymentStatus, {
  foreignKey: "PaymentStatusId",
  targetKey: "Id",
});

PaymentStatus.hasOne(CarRental, {
  foreignKey: "PaymentStatusId",
  targetKey: "Id",
});

CarRental.belongsTo(BookingStatus, {
  foreignKey: "BookedStatusId",
  targetKey: "Id",
});

BookingStatus.hasOne(CarRental, {
  foreignKey: "BookedStatusId",
  targetKey: "Id",
});

//DriverDetail

CarRental.hasOne(DriverDetail, {
  foreignKey: "CarRentalId",
  targetKey: "Id",
});

DriverDetail.belongsTo(CarRental, {
  foreignKey: "CarRentalId",
  targetKey: "Id",
});

//CarOptionalCover

CarRegistration.hasMany(CarOptionalCover, {
  foreignKey: "CarRegistrationId",
  targetKey: "Id",
});

CarOptionalCover.belongsTo(CarRegistration, {
  foreignKey: "CarRegistrationId",
  targetKey: "Id",
});

OptionalCover.hasOne(CarOptionalCover, {
  foreignKey: "OptionalCoverId",
  targetKey: "Id",
});
CarOptionalCover.belongsTo(OptionalCover, {
  foreignKey: "OptionalCoverId",
  targetKey: "Id",
});

//CarRentalOptionalCover
CarRental.hasMany(CarRentalOptionalCover, {
  foreignKey: "CarRentalId",
  targetKey: "Id",
});

CarRentalOptionalCover.belongsTo(CarRental, {
  foreignKey: "CarRentalId",
  targetKey: "Id",
});

OptionalCover.hasOne(CarRentalOptionalCover, {
  foreignKey: "OptionalCoverId",
  targetKey: "Id",
});

CarRentalOptionalCover.belongsTo(OptionalCover, {
  foreignKey: "OptionalCoverId",
  targetKey: "Id",
});

//carIncludeBenifit

CarRegistration.hasMany(CarInclude, {
  foreignKey: "CarRegistrationId",
  targetKey: "Id",
});

CarInclude.belongsTo(CarRegistration, {
  foreignKey: "CarRegistrationId",
  targetKey: "Id",
});

InculdeBenefit.hasOne(CarInclude, {
  foreignKey: "IncludeId",
  targetKey: "Id",
});

CarInclude.belongsTo(InculdeBenefit, {
  foreignKey: "IncludeId",
  targetKey: "Id",
});

//CarAdditionalInclude Benifit
CarRegistration.hasMany(CarAdditionalInclude, {
  foreignKey: "CarRegistrationId",
  targetKey: "Id",
});

CarAdditionalInclude.belongsTo(CarRegistration, {
  foreignKey: "CarRegistrationId",
  targetKey: "Id",
});

AdditionalBenefit.hasOne(CarAdditionalInclude, {
  foreignKey: "AdditionalIncludeId",
  targetKey: "Id",
});
CarAdditionalInclude.belongsTo(AdditionalBenefit, {
  foreignKey: "AdditionalIncludeId",
  targetKey: "Id",
});

//Car Registration City

CarRegistration.hasMany(CarCity, {
  foreignKey: "CarRegistrationId",
  targetKey: "Id",
});

CarCity.belongsTo(CarRegistration, {
  foreignKey: "CarRegistrationId",
  targetKey: "Id",
});

City.hasOne(CarCity, {
  foreignKey: "CityId",
  targetKey: "Id",
});

CarCity.belongsTo(City, {
  foreignKey: "CityId",
  targetKey: "Id",
});

//Favorite Associations

Favorite.belongsTo(CarRegistration, {
  foreignKey: "CarRegeistrationId",
  targetKey: "Id",
});

CarRegistration.hasOne(Favorite, {
  foreignKey: "CarRegeistrationId",
  targetKey: "Id",
});

//Deals & promotions associations

Deal.hasMany(DealSummery, {
  foreignKey: 'DealId',
  targetKey: 'Id'
});

DealSummery.belongsTo(Deal, {
  foreignKey: 'DealId',
  targetKey: 'Id'
});

DealSummery.belongsTo(CarRegistration, {
  foreignKey: "CarRegistrationId",
  targetKey: "Id",
});

CarRegistration.hasOne(DealSummery, {
  foreignKey: "CarRegistrationId",
  targetKey: "Id",
});

HomeBanner.belongsTo(Locality, {
  foreignKey: "LocationId",
  targetKey: "Id",
});

Locality.hasMany(HomeBanner, {
  foreignKey: "LocationId",
  targetKey: "Id",
});

//Table crated or  delete
sequelize
  .sync({
    force: false,
    // force:true
    //  Enable this When you want to create database at the beganing
  })
  .then(() => {
    console.log(`Database & tables created!`);
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = {
  sequelize,
  Sequelize,
  CarType,
  Role,
  User,
  UserProfile,
  AgencyProfile,
  Agency,
  Country,
  City,
  Locality,
  CarMake,
  CarModel,
  CarRegistration,
  CarRentalPrice,
  CarRental,
  PaymentStatus,
  BookingStatus,
  DriverDetail,
  OptionalCover,
  CarOptionalCover,
  CarRentalOptionalCover,
  InculdeBenefit,
  AdditionalBenefit,
  CarInclude,
  CarAdditionalInclude,
  CarCity,
  CoverageType,
  CoverageDetail,
  ConfigChargeRate,
  Favorite,
  Transaction,
  Newsletter,
  RateReview,
  TransmissionTypes,
  BookedPercentage,
  CarBookingStats,
  MetaData,
  MetaPages,
  Deal,
  DealSummery,
  Template,
  FooterUrldata,
  FooterUrl,
  FooterHeader,
  VendorPayment,
  VendorPaymentSummary,
  FaqHeadings,
  FaqQna,
  fueltype,
  ContactUs,
  ContactRevert,
  Sliders,
  Partners,
  MainBanner,
  HomeTexts,
  Banners,
  HomeBanner,
  AboutUsText,
  AboutUsPicture,
  LocationTypeMeta,
  CarPageLabel,
  CarRegistrationLabel,
  Testimonial,
  InvoiceConfig,
  FaqHelpStat,
  MetaTag,
  Scripts,
  SeoLocationData,
  CountryConfig,
  LocalityFaq
};
