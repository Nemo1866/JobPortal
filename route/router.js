const { createUser, resetPassword, resetPasswordBytoken } = require("../controller/canController")


const router=require("express").Router()

router.post("/register",createUser)
router.post("/resetpassword",resetPassword)
router.post("/resetpassword/:token",resetPasswordBytoken)



module.exports=router