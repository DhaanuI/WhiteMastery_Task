const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const univRoute = express.Router();
univRoute.use(express.json());
const moment = require("moment");

require("dotenv").config();

const { UnivModel } = require("../model/UnivModel");


// to register University and then hashing password using Bcrypt
univRoute.post("/register", async (req, res) => {
    const { name, email, password, location, programs, description, phone } = req.body
    const UniversityFound = await UnivModel.findOne({ email })
    if (UniversityFound) {
        res.status(409).send({ "message": "Already University registered" })
    }
    else {
        try {
            let dateFormat = moment().format('D-MM-YYYY');

            bcrypt.hash(password, 5, async function (err, hash) {
                const data = new UnivModel({ name, email, password, location, programs, description, phone, registeredDate: dateFormat })
                await data.save()
                res.status(201).send({ "message": "University Registered" })
            });
        }
        catch (err) {
            res.status(500).send({ "ERROR": err })
        }
    }
})


// to let University login and then create and send token as response
univRoute.post("/login", async (req, res) => {
    const { email, password } = req.body
    let data = await UnivModel.findOne({ email })
    if (!data) {
        return res.send({ "message": "No user found" })
    }
    try {
        bcrypt.compare(password, data.password, function (err, result) {
            if (result) {
                var token = jwt.sign({ UniversityID: data._id }, process.env.key);

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
})


univRoute.patch("/update/:id", async (req, res) => {
    const ID = req.params.id;
    const payload = req.body;
    try {
        await UnivModel.findByIdAndUpdate({ _id: ID }, payload)
        res.send({ "message": "Database modified" })
    }
    catch (err) {
        console.log(err)
        res.send({ "message": "error" })
    }
})


univRoute.delete("/delete/:id", async (req, res) => {
    const ID = req.params.id;
    try {
        await UnivModel.findByIdAndDelete({ _id: ID })
        res.send({ "message": "Database modified" })
    }
    catch (err) {
        console.log(err)
        res.send({ "message": "error" })
    }
})



univRoute.get("/all", async (req, res) => {
    try {
        let data = await UnivModel.find().populate("university")
        res.status(200).send({ "Universitys": data })
    }
    catch (err) {
        res.status(500).send({ "ERROR": err })
    }
})




module.exports = {
    univRoute
}