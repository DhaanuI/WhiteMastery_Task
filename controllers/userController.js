const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { StudModel } = require("../model/StudModel");


const userRegister = async (req, res) => {
    const { name, email, password, subjects, university } = req.body
    const studentFound = await StudModel.findOne({ email })
    if (studentFound) {
        res.status(409).send({ "message": "Already student registered" })
    }
    else {
        try {
            let dateFormat = moment().format('D-MM-YYYY');

            bcrypt.hash(password, 5, async function (err, hash) {
                const data = new StudModel({ name, email, password: hash, subjects, university, registeredDate: dateFormat })
                await data.save()
                res.status(201).send({ "message": "Student Registered" })
            });
        }
        catch (err) {
            res.status(500).send({ "ERROR": err })
        }
    }
}


const userLogin = async (req, res) => {
    const { email, password } = req.body
    let data = await StudModel.findOne({ email })
    if (!data) {
        return res.send({ "message": "No user found" })
    }
    try {
        bcrypt.compare(password, data.password, function (err, result) {
            if (result) {
                var token = jwt.sign({ StudentID: data._id }, process.env.key);

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
        res.status(500).send({ "ERROR": err })
    }
}


const userPatch = async (req, res) => {
    const ID = req.params.id;
    const payload = req.body;
    try {
        await StudModel.findByIdAndUpdate({ _id: ID }, payload)
        res.send({ "message": "Database modified" })
    }
    catch (err) {
        console.log(err)
        res.send({ "message": "error" })
    }
}


const userDelete = async (req, res) => {
    const ID = req.params.id;
    try {
        await StudModel.findByIdAndDelete({ _id: ID })
        res.send({ "message": "Database modified" })
    }
    catch (err) {
        console.log(err)
        res.send({ "message": "error" })
    }
}


const userGet = async (req, res) => {
    try {
        let data;
        const id = req.query.id;

        if (id) {
            data = await StudModel.find({ _id: id }).populate("university");
        } else {
            data = await StudModel.find().populate("university");
        }
        res.status(200).send({ "Students": data })
    }
    catch (err) {
        res.status(500).send({ "ERROR": err })
    }
}


module.exports = {
    userRegister, userLogin, userPatch, userDelete, userGet
}