
const { UnivModel } = require("../model/UnivModel");
const { EventModel } = require("../model/EventModel");
const { logger } = require("../middleware/logger.middleware")


const eventCreate = async (req, res) => {
    const { title, description, date } = req.body

    try {
        const data = new EventModel({ title, description, date, university: req.body.userID })
        await data.save()
        logger.info('Event added');
        res.status(201).send({ "message": "Event Registered" })
    }
    catch (err) {
        logger.error('Error occurred during Event creation ', { "error": err });
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
        logger.error('Updating Event info failed');
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
        logger.error('DELETE failed');
        res.status(400).send({ "message": "error" })
    }
}


const eventGet = async (req, res) => {
    try {
        const events = await EventModel.find().populate("university")
        res.status(200).send({ "Events": events })
    }
    catch (err) {
        logger.error('Unable to pull Events');
        res.status(400).send({ "message": "error" })
    }
}


module.exports = {
    eventCreate, eventPatch, eventDelete, eventGet
}