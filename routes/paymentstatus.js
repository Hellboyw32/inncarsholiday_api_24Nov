var express=require("express");
const {
    PaymentStatus
}=require("../config/database")

var router=express.Router();

var result = {
    returnCode: 0,
    data: null,
    returnMessage: ""
  };

//Get all the Data
router.get('/all',(req,res)=>{
    debugger
    PaymentStatus.findAll({where :{IsActive:true}}).then(cartype=>{
          if(cartype!=null)
          {
              result.returnCode=1;
              result.data=cartype;
              result.returnMessage="Successfull";
              return res.json(result);
          }
      }).catch(err=>{
          result.returnCode=-1;
          result.returnMessage("Server Error");
          return res.json(result);
      })
})




module.exports = router;