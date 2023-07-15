const express = require("express")
const app = express()
app.use(express.json())
require("dotenv").config()

const { connection } = require("./config/db")
const { userRoute } = require("./route/userRoute")
const { univRoute } = require("./route/univRoute")


app.get("/", (req, res) => {
    res.send("Welcome to Backend")
})


app.use("/students", userRoute)
app.use("/university", univRoute)


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