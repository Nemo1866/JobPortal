const { createUser, resetPasswordBytokenForCandidate, candidateLogin, candidateLogout, resetPasswordForCandidate, candidateAppliedJobs, candidateShowAppliedJobs, getUser, welcome, candidategetJobs } = require("../controller/canController")
const {recruiterLogin,recruiterLogout,adminRecruiter,jobAdd, resetPasswordForRecruiter, resetPasswordBytokenForRecruiter, recruiterViewJobs}=require("../controller/recController")
const passport=require("passport")
// const { isAuthenticated } = require("../passport/recruiterConfig")
const { isAuthenticatedRecruiter, isAuthenticatedCandidate,isAuthenticatedAdmin } = require("../passport/candidateConfig")
const { deleteRecruiter, updateRecruiter, deleteJob } = require("../controller/adminController")


const router=require("express").Router()


//For Candidates
router.post("/register",createUser)
router.post("/resetpassword",resetPasswordForCandidate)

router.post("/resetpassword/:token",resetPasswordBytokenForCandidate)

// router.post("/candidate/login",passport.authenticate("local"),candidateLogin)
router.get("/candidate/jobs",isAuthenticatedCandidate,candidategetJobs)

router.get("/logout",candidateLogout)

router.get("/candidate/appliedjobs/:id",isAuthenticatedCandidate,candidateAppliedJobs)

router.get("/candidate/showapplies",isAuthenticatedCandidate,candidateShowAppliedJobs)

// router.get("/getusers/:id",isAuthenticated,getUser)


//For Recruiters

// router.post("/recruiter/login",passport.authenticate("local"),recruiterLogin)
router.post("/recruiter/logout",recruiterLogout)

router.post("/recruiter/jobadd",isAuthenticatedRecruiter,jobAdd)
router.post("/recruiter/resetpassword",resetPasswordForRecruiter)
router.post("/recruiter/resetpassword/:token",resetPasswordBytokenForRecruiter)
router.post("/recruiter/viewjobs",isAuthenticatedRecruiter,recruiterViewJobs)


//For Login Candidate and Recruiter
router.post("/login",passport.authenticate("local"),welcome)


//Admin Routes
router.post("/admin/recruiter/register",isAuthenticatedAdmin,adminRecruiter)
router.get("/admin/delete/recruiter/:id",isAuthenticatedAdmin,deleteRecruiter)
router.post("/admin/update/recruiter/:id",isAuthenticatedAdmin,updateRecruiter)
router.post("/admin/deletejob/:id",isAuthenticatedAdmin,deleteJob)







module.exports=router