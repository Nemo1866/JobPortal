const { createUser, resetPasswordBytokenForCandidate, candidateLogin, candidateLogout, resetPasswordForCandidate, candidateAppliedJobs, candidateShowAppliedJobs, getUser } = require("../controller/canController")
const {recruiterLogin,recruiterLogout,adminRecruiter,jobAdd}=require("../controller/recController")
const passport=require("passport")
const { isAuthenticated } = require("../passport/recruiterConfig")


const router=require("express").Router()


//For Candidates
router.post("/register",createUser)

router.post("/resetpassword",resetPasswordForCandidate)

router.post("/resetpassword/:token",resetPasswordBytokenForCandidate)

router.post("/candidate/login",passport.authenticate("local"),candidateLogin)

router.get("/logout",candidateLogout)

router.get("/candidate/appliedjobs/:id",isAuthenticated,candidateAppliedJobs)

router.get("/candidate/showapplies",isAuthenticated,candidateShowAppliedJobs)

router.get("/getusers/:id",isAuthenticated,getUser)


//For Recruiters

router.post("/recruiter/login",passport.authenticate("local"),recruiterLogin)
router.post("/recruiter/logout",recruiterLogout)
router.post("/admin/recruiter/register",adminRecruiter)
router.post("/recruiter/jobadd",isAuthenticated,jobAdd)





module.exports=router