const express = require("express")
const app = express()
app.use(express.json())
require("dotenv").config()

const { connection } = require("./config/db")
const { userRoute } = require("./route/userRoute")
const { univRoute } = require("./route/univRoute")
const { eventRoute } = require("./route/eventRoute")

const {logRequestDetails}= require("./middleware/logger.middleware")


app.get("/", (req, res) => {
    res.send("Welcome to Backend")
})


// Apply the middleware to all routes
app.use(logRequestDetails);

app.use("/students", userRoute)
app.use("/university", univRoute)
app.use("/events", eventRoute)


app.listen(process.env.port, async () => {
    try {
        await connection;
        console.log("DB is connected")
    }
    catch (err) {
        console.log("DB is not connected", err)
    }

    console.log(`Listening to server at port ${process.env.port}`)
})