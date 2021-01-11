const express = require("express");
const router = express.Router();
const Patient = require("./models/patient")


//____ Create ______
router.post("/patient", (req,res) => {
  const {name, age, sex, bed} = req.body
  console.log("new user", name, bed, age, sex)
  const patient = new Patient({ bed, name, age, sex })
  patient.save((err)=>{
        if(err){
            console.log(err)
        }else{
            console.log("new patient admitted")
        }
    })
})

//____ Read All______
router.get("/patient", (req,res)=>{
  Patient.find( function (err, patients) {
    if(err){
        console.log(err)
    }else{
        res.json(patients)
    }
  })
})

//____ Read ______
router.get("/patient/:bed", (req,res)=>{
  const bed = parseInt(req.params.bed)
  Patient.findOne({ bed: bed }, function (err, patient){
    if(err){
        console.log(err)
    }else{
        res.json(patient)
    }
  })
})



//____ Update ______
router.put("/patient/:bed", (req,res)=>{
  const {name, age, sex} = req.body
  const bed = parseInt(req.params.bed)
  
  console.log(bed, name, age, sex)
  Patient.findOneAndUpdate({ bed:bed }, {$set:{ name, age, sex }},function(err, doc){
    if(err){
        console.log("Something wrong when updating data!");
    }
    console.log(doc);
  });

})


//____ Delete ______
router.delete("/patient/:bed", (req,res)=>{
  console.log("delete route hit")
  console.log(req.body.bed)
  const bed = req.body.bed
  Patient.remove({ bed: bed}, (err)=>{
    if(err){
      console.log(err)
    }else{
      console.log("successfully deleted it")
    }
  });
})


module.exports = router;
