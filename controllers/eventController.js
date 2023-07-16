
const { UnivModel } = require("../model/UnivModel");
const { EventModel } = require("../model/EventModel");


const eventCreate = async (req, res) => {
    const { title, description, date } = req.body

    try {
        const data = new EventModel({ title, description, date, university: req.body.userID })
        await data.save()
        res.status(201).send({ "message": "Event Registered" })
    }
    catch (err) {
        res.status(400).send({ "ERROR": err })
    }
}


const eventPatch = async (req, res) => {
    const payload = req.body;
    const ID = req.params.id;
    try {
        await EventModel.findByIdAndUpdate({ _id: ID }, payload)
        res.send({ "message": "Event modified" })
    }
    catch (err) {
        console.log(err)
        res.status(400).send({ "message": "error" })
    }
}


const eventDelete = async (req, res) => {
    const ID = req.params.id;
    try {
        await EventModel.findByIdAndDelete({ _id: ID })
        res.send({ "message": "Event Deleted" })
    }
    catch (err) {
        console.log(err)
        res.status(400).send({ "message": "error" })
    }
}


const eventGet = async (req, res) => {
    try {
        const events = await EventModel.find().populate("university")
        res.status(200).send({ "Events": events })
    }
    catch (err) {
        console.log(err)
        res.status(400).send({ "message": "error" })
    }
}


module.exports = {
    eventCreate, eventPatch, eventDelete, eventGet
}