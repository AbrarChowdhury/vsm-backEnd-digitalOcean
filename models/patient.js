const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
    name: String,
    bed: Number,
    age: Number,
    sex: String,
})

module.exports = mongoose.model('Patient', patientSchema)
