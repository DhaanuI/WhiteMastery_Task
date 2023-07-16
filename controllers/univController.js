const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UnivModel } = require("../model/UnivModel");
require("dotenv").config();
const { validationResult } = require('express-validator');

const { logger } = require("../middleware/logger.middleware")


const univRegister = async (req, res) => {

    const errors = validationResult(req);

    // email validation using Express-Validation
    if (!errors.isEmpty()) {
        logger.error('Email is INVALID');
        return res.status(400).json({ "message": "Email is INVALID" });
    }

    const { name, email, password, location, programs, description, phone } = req.body
    const UniversityFound = await UnivModel.findOne({ email })
    if (UniversityFound) {
        logger.warn('Already University registered');
        res.status(409).send({ "message": "Already University registered" })
    }
    else {
        try {
            let dateFormat = moment().format('D-MM-YYYY');

            bcrypt.hash(password, 5, async function (err, hash) {
                const data = new UnivModel({ name, email, password: hash, location, programs, description, phone, registeredDate: dateFormat })
                await data.save()
                logger.info('University added');
                res.status(201).send({ "message": "University Registered" })
            });
        }
        catch (err) {
            logger.error('University failed to add');
            res.status(400).send({ "ERROR": err })
        }
    }
}


const univLogin = async (req, res) => {
    const { email, password } = req.body
    let data = await UnivModel.findOne({ email })
    if (!data) {
        logger.warn('No user found');
        return res.send({ "message": "No user found" })
    }
    try {
        bcrypt.compare(password, data.password, function (err, result) {
            if (result) {
                var token = jwt.sign({ UniversityID: data._id }, process.env.key, { expiresIn: 3 * 60 * 60 });
                logger.info('Validation done during LOGIN');
                res.status(201).send({
                    "message": "Validation done",
                    "token": token,
                    "name": data.name,
                    "id": data._id
                })
            }
            else {
                logger.warn('INVALID credentials');
                res.status(401).send({ "message": "INVALID credentials" })
            }
        });
    }
    catch (err) {
        logger.error('Login failed');
        res.status(400).send({ "ERROR": err })
    }
}


const univPatch = async (req, res) => {
    const ID = req.params.id;
    const payload = req.body;
    try {
        if (ID === payload.userID) {
            await UnivModel.findByIdAndUpdate({ _id: ID }, payload)
            logger.info('Updated University info');
            res.send({ "message": "Database modified" })
        }
        else {
            logger.warn('Not authorized');
            res.send({ "message": "Not authorized" })
        }
    }
    catch (err) {
        logger.error('Updating University info failed');
        res.status(400).send({ "message": "error" })
    }
}


const univDelete = async (req, res) => {
    const ID = req.params.id;
    try {
        if (ID === req.body.userID) {
            await UnivModel.findByIdAndDelete({ _id: ID })
            logger.info('Deleted user info');
            res.send({ "message": "Database modified" })
        }
        else {
            logger.warn('Not authorized');
            res.send({ "message": "Not authorized" })
        }
    }
    catch (err) {
        logger.error('Unable to delete Univ info');
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
        res.status(200).send({ "Universities": data })
    }
    catch (err) {
        logger.error('Unable to fetch Universities');
        res.status(400).send({ "ERROR": err })
    }
}


module.exports = {
    univRegister, univLogin, univPatch, univDelete, univGet
}