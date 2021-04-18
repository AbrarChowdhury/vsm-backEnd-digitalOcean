const Bed = require("./models/bed");
const VitalSign = require("./models/vitalSign");
const moment = require("moment");

function saveToDB(bedNumber, message) {
  Bed.findOne({ bedNumber }, (err, { patient }) => {
    if (err) {
      return;
    }
      const date = moment().format("MMM Do YY");
      const hour = new Date().getHours();
      const vitalSign = new VitalSign({ message, hour, date, patient });
    vitalSign.save((err) => {
      if (err) {
        return;
      }
      console.log("stored")
    });
  });
}
exports.saveToDB = saveToDB;
