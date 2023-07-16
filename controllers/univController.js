const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UnivModel } = require("../model/UnivModel");
require("dotenv").config();


const univRegister = async (req, res) => {
    const { name, email, password, location, programs, description, phone } = req.body
    const UniversityFound = await UnivModel.findOne({ email })
    if (UniversityFound) {
        res.status(409).send({ "message": "Already University registered" })
    }
    else {
        try {
            let dateFormat = moment().format('D-MM-YYYY');

            bcrypt.hash(password, 5, async function (err, hash) {
                const data = new UnivModel({ name, email, password: hash, location, programs, description, phone, registeredDate: dateFormat })
                await data.save()
                res.status(201).send({ "message": "University Registered" })
            });
        }
        catch (err) {
            res.status(400).send({ "ERROR": err })
        }
    }
}


const univLogin = async (req, res) => {
    const { email, password } = req.body
    let data = await UnivModel.findOne({ email })
    if (!data) {
        return res.send({ "message": "No user found" })
    }
    try {
        bcrypt.compare(password, data.password, function (err, result) {
            if (result) {
                var token = jwt.sign({ UniversityID: data._id }, process.env.key, { expiresIn: 3 * 60 * 60 });

                res.status(201).send({
                    "message": "Validation done",
                    "token": token,
                    "name": data.name,
                    "id": data._id
                })
            }
            else {
                res.status(401).send({ "message": "INVALID credentials" })
            }
        });
    }
    catch (err) {
        res.status(400).send({ "ERROR": err })
    }
}


const univPatch = async (req, res) => {
    const ID = req.params.id;
    const payload = req.body;
    try {
        if (ID === payload.userID) {
            await UnivModel.findByIdAndUpdate({ _id: ID }, payload)
            res.send({ "message": "Database modified" })
        }
        else {
            res.send({ "message": "Not authorized" })
        }
    }
    catch (err) {
        console.log(err)
        res.status(400).send({ "message": "error" })
    }
}


const univDelete = async (req, res) => {
    const ID = req.params.id;
    try {
        if (ID === req.body.userID) {
            await UnivModel.findByIdAndDelete({ _id: ID })
            res.send({ "message": "Database modified" })
        }
        else {
            res.send({ "message": "Not authorized" })
        }
    }
    catch (err) {
        console.log(err)
        res.status(400).send({ "message": "error" })
    }
}


const univGet = async (req, res) => {
    try {
        let data;
        const id = req.query.id;

        if (id) {
            data = await UnivModel.find({ _id: id })
        } else {
            data = await UnivModel.find()
        }
        res.status(200).send({ "Universitys": data })
    }
    catch (err) {
        res.status(400).send({ "ERROR": err })
    }
}


module.exports = {
    univRegister, univLogin, univPatch, univDelete, univGet
}