const mongoose = require("mongoose")

const univSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: { type: String, required: true },
    programs: [String],
    description: { type: String, required: true },
    phone: Number,
    registeredDate: { type: String },            // note down the date registered
})

const UnivModel = mongoose.model("univ", univSchema)

module.exports = {
    UnivModel
}