const mongoose = require("mongoose");

const bedSchema = new mongoose.Schema({
    bed: Number,
    patient:  {type: Mongoose.Schema.Types.ObjectId, ref: 'Patient'}
})
module.exports = mongoose.model('Bed', bedSchema)
