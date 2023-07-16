const mongoose = require("mongoose")

const { UnivModel } = require("./UnivModel")

const studSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    subjects: [String],
    profilePicture: { type: String },
    university: { type: mongoose.Schema.Types.ObjectId, ref: UnivModel },
    registeredDate: { type: String },            // note down the date registered
})

const StudModel = mongoose.model("user", studSchema)

module.exports = {
    StudModel
}