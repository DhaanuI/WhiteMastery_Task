const express = require("express");
const { univRegister, univLogin, univPatch, univDelete, univGet } = require("../controllers/univController")
const univRoute = express.Router();
univRoute.use(express.json());


// to register University and then hashing password using Bcrypt
univRoute.post("/register", univRegister)


// to let University login and then create and send token using JWT as response
univRoute.post("/login", univLogin)


// update particular University 
univRoute.patch("/update/:id", univPatch)


// delete particular University 
univRoute.delete("/delete/:id", univDelete)


// get particular University or all 
univRoute.get("/", univGet)


module.exports = {
    univRoute
}