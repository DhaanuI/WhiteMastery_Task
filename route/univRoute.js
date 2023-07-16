const express = require("express");
const { univRegister, univLogin, univPatch, univDelete, univGet } = require("../controllers/univController")
const univRoute = express.Router();
univRoute.use(express.json());
const { body } = require('express-validator');

const {authenticate}= require("../middleware/authenticate.middleware")


// to register University and then hashing password using Bcrypt
univRoute.post("/register",body('email').isEmail().normalizeEmail(), univRegister)


// to let University login and then create and send token using JWT as response
univRoute.post("/login", univLogin)


// get particular University or all 
univRoute.get("/", univGet)


univRoute.use(authenticate)


// update particular University 
univRoute.patch("/update/:id", univPatch)


// delete particular University 
univRoute.delete("/delete/:id", univDelete)


module.exports = {
    univRoute
}