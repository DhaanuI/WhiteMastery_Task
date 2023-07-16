const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sharp = require('sharp');
const multer = require("multer")
const path = require("path")
const { validationResult } = require('express-validator');

const { StudModel } = require("../model/StudModel");
require("dotenv").config();

const { sendEmail } = require("../nodemailer/sendingEmail")

const { logger } = require("../middleware/logger.middleware")


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})


const upload = multer({ storage: storage })


const userRegister = async (req, res) => {
    const errors = validationResult(req);

    // email validation using Express-Validation
    if (!errors.isEmpty()) {
        logger.error('Email is INVALID');
        return res.status(400).json({ "message": "Email is INVALID" });   
    }

    const { name, email, password, subjects, university } = req.body

    const studentFound = await StudModel.findOne({ email })
    if (studentFound) {
        logger.warn('Already student registered');
        res.status(409).send({ "message": "Already student registered" })
    }
    else {
        try {

            let dateFormat = moment().format('D-MM-YYYY');
            bcrypt.hash(password, 5, async function (err, hash) {
                const data = new StudModel({ name, email, password: hash, subjects, university, registeredDate: dateFormat })
                await data.save()


                await sendEmail({
                    email: email,
                    subject: `Account registered`,
                    body: `Hello ${name},\n
                    Welcome to our platform! We are excited to have you join our community. Here are your account details:\n\n
                    Username: ${email}\n\n
                    Please take a moment to complete your profile and provide any additional information that will help us personalize your experience.\n
                    You can access your profile by logging into your account and navigating to the profile settings page.\n\n
                    If you have any questions or need assistance, please don't hesitate to reach out to our support team.\n
                    We're here to help!\n\n
                    Good Luck.`
                });
                logger.info('User added');
                res.status(201).send({ "message": "Student Registered" })
                
            });
        }
        catch (err) {
            logger.error('Error occurred during user post', { error: err });
            res.status(400).send({ "ERROR": err })
        }
    }
}


const userProfile = async (req, res) => {
    const ID = req.params.id;

    // Access the uploaded file details through req.file
    const filePath = req.file.path;

    // Generate a low-quality version of the image using sharp library
    const lowQualityPath = './uploads/low-quality-' + req.file.filename; // Path for the low-quality version

    try {
        await sharp(filePath)
            .resize(200) // Example: Resize the image to a width of 200 pixels
            .toFile(lowQualityPath);

        await StudModel.findByIdAndUpdate({ _id: ID }, { profilePicture: lowQualityPath })
        logger.info('Profile Picture updated');
         res.send({ "message": "Profile Picture updated" })
    }
    catch (err) {
        logger.error('Error during Prof pic update');
        res.status(400).send({ "ERROR": err })
    }
}


const userLogin = async (req, res) => {
    const errors = validationResult(req);

    // email validation using Express-Validation
    if (!errors.isEmpty()) {
        logger.error('Email is INVALID');
        return res.status(400).json({ "message": "Email is INVALID" });
    }

    const { email, password } = req.body
    let data = await StudModel.findOne({ email })
    if (!data) {
        logger.warn('No user found');
        return res.send({ "message": "No user found" })
    }
    try {
        bcrypt.compare(password, data.password, function (err, result) {
            if (result) {
                var token = jwt.sign({ StudentID: data._id }, process.env.key, { expiresIn: 3 * 60 * 60 });
                logger.info('Validation done during LOGIN');
                res.status(201).send({
                    "message": "Validation done",
                    "token": token,
                    "name": data.name,
                    "id": data._id
                })
            }
            else {
                logger.warn('Login failed');
                res.status(401).send({ "message": "INVALID credentials" })
            }
        });
    }
    catch (err) {
        logger.error('Login failed');
        res.status(400).send({ "ERROR": err })
    }
}


const userPatch = async (req, res) => {
    const ID = req.params.id;
    const payload = req.body;
    try {
        if (ID === payload.userID) {
            await StudModel.findByIdAndUpdate({ _id: ID }, payload)
            logger.info('Updated user info');
            res.send({ "message": "Database modified" })
        }
        else {
            logger.warn('Not authorized');
            res.send({ "message": "Not authorized" })
        }
    }
    catch (err) {
        logger.error('Updating user info failed');
        res.status(400).send({ "message": "error" })
    }
}


const userDelete = async (req, res) => {
    const ID = req.params.id;
    try {
        if (ID === req.body.userID) {
            await StudModel.findByIdAndDelete({ _id: ID })
            logger.info('deleted user info');
            res.send({ "message": "Database modified" })
        }
        else {
            logger.warn('Not authorized');
            res.send({ "message": "Not authorized" })
        }
    }
    catch (err) {
        logger.error('DELETE failed');
        res.status(400).send({ "message": "error" })
    }
}


const userGet = async (req, res) => {
    // page to be passed by user
    // .skip((page-1)*2).limit(3)   ---- > Pagination
    try {
        let data;
        const id = req.query.id;
        const page = req.query.page

        // limit per page is 3 students
        if (id && page) {
            data = await StudModel.find({ _id: id }).skip((page - 1) * 2).limit(3).populate("university");
        } else if (page) {
            data = await StudModel.find().skip((page - 1) * 2).limit(3).populate("university");
        } else if (id) {
            data = await StudModel.find({ _id: id }).populate("university");
        }
        else data = await StudModel.find().populate("university");


        res.status(200).send({ "Students": data })
    }
    catch (err) {
        logger.error('Unable to fetch students');
        res.status(400).send({ "ERROR": err })
    }
}


module.exports = {
    userRegister, userLogin, userPatch, userDelete, userGet, upload, userProfile
}