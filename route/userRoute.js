const express = require("express");
const { userRegister, userLogin, userPatch, userDelete, userGet, upload, userProfile } = require("../controllers/userController");
const userRoute = express.Router();
userRoute.use(express.json());
const { body } = require('express-validator');
const { authenticate } = require("../middleware/authenticate.middleware");


// to register student and then hashing password using Bcrypt
// Validation of email 
userRoute.post("/register", body('email').isEmail().normalizeEmail(), userRegister)


// to Update Profile Picture
userRoute.patch("/upload/:id", upload.single('profilePicture'), userProfile)


// to let student login and then create and send token as response
userRoute.post("/login", body('email').isEmail().normalizeEmail(), userLogin)


// get particular Student or all students
userRoute.get("/", userGet)


userRoute.use(authenticate)


// update particular Student 
userRoute.patch("/update/:id", userPatch)


// delete particular Student 
userRoute.delete("/delete/:id", userDelete)


module.exports = {
    userRoute
}