const express = require("express");
const router = express.Router();
router.use(express.json());
const Patient = require("./models/patient");
const Bed = require("./models/bed");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;

//____Bed Create _________________________________________
router.post("/bed/:bed", (req, res) => {
  const bedNumber = parseInt(req.params.bed);
  console.log("bed Number", bedNumber);
  const bed = new Bed({ bedNumber, occupied: false });
  bed.save((err) => {
    if (err) {
      console.log(err);
      res.error(err);
    } else {
      console.log("new bed added");
      res.status(201).json(bedNumber);
    }
  });
});
//____ Create _________________________________________
router.post("/patient", (req, res) => {
  const { name, age, sex, bed } = req.body;
  console.log("new user", name, bed, age, sex);
  const patient = new Patient({ bed, name, age, sex, current: true });
  patient.save((err, patient) => {
    if (err) {
      console.log(err);
      res.error(err);
    } else {
      console.log("new patient admitted", patient);
      res.status(201);
      Bed.findOneAndUpdate(
        { bedNumber: bed },
        { $set: { occupied: true, patient: patient._id } },
        (err, foundBed) => {
          if (err) {
            console.log("something went wrong", err);
            res.error(err);
          } else {
            console.log(foundBed);
          }
        }
      );
    }
  });
});
//____ Read All current patient__________________________________________
router.get("/patient", (req, res) => {
  Patient.find({ current: true }, function (err, patients) {
    if (err) {
      console.log(err);
    } else {
      res.json(patients);
    }
  });
});

//____ Read _____________________________________________
router.get("/patient/:bed", (req, res) => {
  const bed = parseInt(req.params.bed);
  Bed.findOne({ bedNumber: bed }, function (err, { occupied, patient }) {
    if (err) {
      console.log(err);
      res.json("no patient");
    } else {
      if (occupied) {
        Patient.findById(patient, (err, foundPatient) => {
          if (err) {
            console.log(err);
            res.json("no patient");
          } else {
            res.json(foundPatient);
          }
        });
      } else {
        console.log(`bed number ${bed} is empty`);
        res.json("no patient");
      }
    }
  });
});
//____ Update ___________________________________________
router.put("/patient/:bed", (req, res) => {
  const bed = parseInt(req.params.bed);
  const { name, age, sex } = req.body;
  Bed.findOne({ bedNumber: bed }, function (err, { patient }) {
    if (err) {
      console.log("Something wrong when updating data!");
    } else {
      Patient.findOneAndUpdate(
        { _id: patient },
        { $set: { name, age, sex } },
        function (err, doc) {
          if (err) {
            console.log("Something wrong when updating data!");
          }
          console.log(doc);
        }
      );
    }
  });
});

//____ Delete ___________________________________________
router.delete("/patient/:bed", (req, res) => {
  console.log("delete route hit");
  console.log(req.body.bed);
  const bed = req.body.bed;
  Patient.remove({ bed: bed }, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("successfully deleted it");
    }
  });
});
// esp data
router.post("/esp/:id", (req, res) => {
  const patientId = parseInt(req.params.id);
  Patient.findByIdAndUpdate(
    patientId,
    { $push: { vitalSigns: message } },
    (err) => {
      if (err) {
        res.status(400);
      }
      console.log("stored");
      res.status(200);
    }
  );
});

router.post("/login", (req, res) => {
  //authenticaticate
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err) {
      console.log(err);
      res.status(400)
    } else {
      bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
          console.log("authenticated");
          res.status(200).json({ username: user.username, email: user.email });
        } else {
          console.log(err, "wrong password");
          res.status(400).json("invalid password");
        }
      });
    }
  }).orFail(()=>{
    res.status(400).json("user does not exist");
  });
});

router.post("/register", (req, res) => {
  const { email, username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, saltRounds);
  const user = new User({ email, username, password: hashedPassword });
  console.log(user);
  user.save((err, registeredUser) => {
    if (err) {
      console.log("failed to create user", err);
      res.sendStatus(400);
    } else {
      console.log("new user added", registeredUser);
      res.sendStatus(200);
    }
  });
});

module.exports = router;
