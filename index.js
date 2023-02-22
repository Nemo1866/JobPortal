const express=require("express")
const router = require("./route/router")
const app=express()
require("./connection")

app.use(express.json())

app.use("/",router)


app.listen(3000,()=>{
    console.log("Sucessfully running on port 3000");
})