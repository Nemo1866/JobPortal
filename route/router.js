const { createUser, resetPassword, resetPasswordBytoken, login, logout } = require("../controller/canController")
const passport=require("passport")


const router=require("express").Router()



router.post("/register",createUser)
router.post("/resetpassword",resetPassword)
router.post("/resetpassword/:token",resetPasswordBytoken)
router.post("/login",passport.authenticate("local"),login)
router.get("/logout",logout)



module.exports=router