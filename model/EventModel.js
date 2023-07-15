const mongoose = require("mongoose")

const { UnivModel } = require("./UnivModel")

const eventSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    university: { type: mongoose.Schema.Types.ObjectId, ref: UnivModel },
})

const EventModel = mongoose.model("event", eventSchema)

module.exports = {
    EventModel
}