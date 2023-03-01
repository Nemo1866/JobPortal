const { createUser, resetPasswordBytokenForCandidate, candidateLogin, candidateLogout, resetPasswordForCandidate, candidateAppliedJobs, candidateShowAppliedJobs, getUser, welcome, candidategetJobs } = require("../controller/canController")
const {recruiterLogin,recruiterLogout,adminRecruiter,jobAdd, resetPasswordForRecruiter, resetPasswordBytokenForRecruiter, recruiterViewJobs}=require("../controller/recController")
const passport=require("passport")
// const { isAuthenticated } = require("../passport/recruiterConfig")
const { isAuthenticatedRecruiter, isAuthenticatedCandidate,isAuthenticatedAdmin } = require("../passport/candidateConfig")
const { deleteRecruiter, updateRecruiter, deleteJob, allJobs, allRecruiters, allCandidates, candidateJobs, removeCandidate, exportAll, logout } = require("../controller/adminController")


const router=require("express").Router()


//For Candidates
router.post("/candidate/register",createUser)
router.post("/candidate/resetpassword",resetPasswordForCandidate)

router.post("/candidate/resetpassword/:token",resetPasswordBytokenForCandidate)

// router.post("/candidate/login",passport.authenticate("local"),candidateLogin)
router.get("/candidate/jobs",isAuthenticatedCandidate,candidategetJobs)

router.get("/candidate/logout",isAuthenticatedCandidate,candidateLogout)

router.get("/candidate/applyjob/:id",isAuthenticatedCandidate,candidateAppliedJobs)

router.get("/candidate/showapplied",isAuthenticatedCandidate,candidateShowAppliedJobs)

// router.get("/getusers/:id",isAuthenticated,getUser)


//For Recruiters

// router.post("/recruiter/login",passport.authenticate("local"),recruiterLogin)
router.get("/recruiter/logout",isAuthenticatedRecruiter,recruiterLogout)

router.post("/recruiter/addjob",isAuthenticatedRecruiter,jobAdd)
router.post("/recruiter/resetpassword",resetPasswordForRecruiter)
router.post("/recruiter/resetpassword/:token",resetPasswordBytokenForRecruiter)
router.post("/recruiter/viewjobs",isAuthenticatedRecruiter,recruiterViewJobs)


//For Login Candidate and Recruiter
router.post("/login",passport.authenticate("local"),welcome)


//Admin Routes
router.post("/admin/recruiter/register",isAuthenticatedAdmin,adminRecruiter)
router.get("/admin/delete/recruiter/:id",isAuthenticatedAdmin,deleteRecruiter)
router.post("/admin/update/recruiter/:id",isAuthenticatedAdmin,updateRecruiter)
router.get("/admin/deletejob/:id",isAuthenticatedAdmin,deleteJob)
router.get("/admin/jobs",isAuthenticatedAdmin,allJobs)
router.get("/admin/recruiters",isAuthenticatedAdmin,allRecruiters)
router.get("/admin/candidates",isAuthenticatedAdmin,allCandidates)
router.get("/admin/candidate/jobs",isAuthenticatedAdmin,candidateJobs)
router.get("/admin/delete/candidate/:id",isAuthenticatedAdmin,removeCandidate)
router.get("/admin/exportall",isAuthenticatedAdmin,exportAll)
router.get("/admin/logout",isAuthenticatedAdmin,logout)








module.exports=router