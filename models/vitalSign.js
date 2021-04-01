const mongoose = require("mongoose");

const vitalSignSchema = new mongoose.Schema({
  message: Object,
  hour: Number,
  date: String,
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
});

module.exports = mongoose.model("VitalSign", vitalSignSchema);
