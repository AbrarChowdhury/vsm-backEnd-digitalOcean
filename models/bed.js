const mongoose = require("mongoose"); 
const Patient = require("./patient")

const bedSchema = new mongoose.Schema({
    bedNumber: Number,
    occupied: Boolean,
    patient:  {type: mongoose.Schema.Types.ObjectId, ref: 'Patient'},
})
module.exports = mongoose.model('Bed', bedSchema)
