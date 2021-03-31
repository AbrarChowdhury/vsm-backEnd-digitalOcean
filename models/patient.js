const mongoose = require("mongoose");
const patientSchema = new mongoose.Schema({
    name: String,
    bed: Number,
    age: Number,
    sex: String,
    current: Boolean,
    vitalSigns: Array,
})
module.exports = mongoose.model('Patient', patientSchema)
