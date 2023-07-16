const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sharp = require('sharp');
const multer = require("multer")
const path = require("path")
const { StudModel } = require("../model/StudModel");
require("dotenv").config();


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
        res.send({ "message": "Profile Picture updated" })
    }
    catch (err) {
        res.status(500).send({ "ERROR": err })
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
                var token = jwt.sign({ StudentID: data._id }, process.env.key, { expiresIn: 3 * 60 * 60 });

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
        if (ID === payload.userID) {
            await StudModel.findByIdAndUpdate({ _id: ID }, payload)
            res.send({ "message": "Database modified" })
        }
        else {
            res.send({ "message": "Not authorized" })
        }
    }
    catch (err) {
        console.log(err)
        res.send({ "message": "error" })
    }
}


const userDelete = async (req, res) => {
    const ID = req.params.id;
    try {
        if (ID === req.body.userID) {
            await StudModel.findByIdAndDelete({ _id: ID })
            res.send({ "message": "Database modified" })
        }
        else {
            res.send({ "message": "Not authorized" })
        }
    }
    catch (err) {
        console.log(err)
        res.send({ "message": "error" })
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
        res.status(500).send({ "ERROR": err })
    }
}


module.exports = {
    userRegister, userLogin, userPatch, userDelete, userGet, upload, userProfile
}