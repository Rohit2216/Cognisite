const express=require("express")
const mongoose=require("mongoose")
const { connection } = require("./config/db")
const {ScheduleRouter}=require("./route/schedule.route")
const cors=require("cors")
require("dotenv").config()

const app=express()

app.use(express.json())
app.use(cors())

app.use("/sch",ScheduleRouter)

app.get("/",(req,res)=>{
    // console.log("Welcome to Cognisite")
    res.send("Welcome to Cognisite")
})

app.listen(process.env.port, async(res,req)=>{
    try {
        await connection
        console.log("Database connected Successfully!")
    } catch (error) {
        console.log("Database not connected.")
        console.error(error)
    }

    console.log(`Server is running on port: ${process.env.port}`)
})