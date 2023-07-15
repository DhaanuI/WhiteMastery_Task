const express = require("express");
const { eventCreate, eventPatch, eventDelete, eventGet } = require("../controllers/eventController")
const eventRoute = express.Router();
eventRoute.use(express.json());
const { authenticate } = require("../middleware/authenticate.middleware")


eventRoute.get("/", eventGet)

eventRoute.use(authenticate)


// to register event 
eventRoute.post("/add", eventCreate)


// update particular event 
eventRoute.patch("/update/:id", eventPatch)


// delete particular event 
eventRoute.delete("/delete/:id", eventDelete)


module.exports = {
    eventRoute
}