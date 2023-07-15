const express = require("express");
const { userRegister, userLogin, userPatch, userDelete, userGet } = require("../controllers/userController")
const userRoute = express.Router();
userRoute.use(express.json());


// to register student and then hashing password using Bcrypt
userRoute.post("/register", userRegister)


// to let student login and then create and send token as response
userRoute.post("/login", userLogin)


// update particular Student 
userRoute.patch("/update/:id", userPatch)


// delete particular Student 
userRoute.delete("/delete/:id", userDelete)


// get particular Student or all students
userRoute.get("/", userGet)


module.exports = {
    userRoute
}