const { createUser } = require("../controller/canController")


const router=require("express").Router()

router.post("/register",createUser)



module.exports=router