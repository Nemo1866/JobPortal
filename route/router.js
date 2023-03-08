const { createUser, resetPasswordBytokenForCandidate, candidateLogin, candidateLogout, resetPasswordForCandidate, candidateAppliedJobs, candidateShowAppliedJobs, getUser, welcome, candidategetJobs } = require("../controller/canController")
const {recruiterLogin,recruiterLogout,adminRecruiter,jobAdd, resetPasswordForRecruiter, resetPasswordBytokenForRecruiter, recruiterViewJobs}=require("../controller/recController")
const passport=require("passport")
// const { isAuthenticated } = require("../passport/recruiterConfig")
const { isAuthenticatedRecruiter, isAuthenticatedCandidate,isAuthenticatedAdmin } = require("../passport/candidateConfig")
const { deleteRecruiter, updateRecruiter, deleteJob, allJobs, allRecruiters, allCandidates, candidateJobs, removeCandidate, exportAll, logout } = require("../controller/adminController")


const router=require("express").Router()


//For Candidates
router.post("/candidate/register",createUser)
/**
 * @swagger
 * /candidate/register:
 *   post:
 *     tags:
 *       - Candidate
 *     summary: Resgiter Candidate.
 *     description: Register the candidate with their firstName lastName email & password using only special password (8 characters long must have atleast one uppercase,lowercase,numeric & special character).
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The first name of the candidate.
 *               lastName:
 *                 type: string
 *                 description : the last name of the candidate.
 *               email:
 *                 type: string
 *                 description: The email of the candidate.
 *               password:
 *                 type: string
 *                 description: The password of the candidate.
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Register Candidate.
 *             example:
 *               message: "Registered Sucessfully"
 */




router.post("/candidate/resetpassword",resetPasswordForCandidate)
/**
 * @swagger
 * /candidate/resetpassword:
 *   post:
 *     tags:
 *       - Candidate
 *     summary: Password Resetter for candidate.
 *     description: It Will Take the req.body as email and verify if that email exists , if exist then send an email to the candidate with a token .
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the candidate.
 *             required:
 *               - email
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: reset password for the Candidate.
 *             example:
 *               message: Token Sent to your email.
 */

router.post("/candidate/resetpassword/:token",resetPasswordBytokenForCandidate)
/**
 * @swagger
 * /candidate/resetpassword/{token}:
 *   post:
 *     tags:
 *       - Candidate
 *     summary: Password Update for candidate.
 *     description: it will first verify the token from the params and if the token is same as sent to candidate email then it will update the candidate password.
 *     parameters:
 *       - name: token
 *         in: path
 *         description: The token for resetting password.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the candidate.
 *               password:
 *                 type: string
 *                 description : The password of the candidate.
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: reset password for the Candidate via token.
 *             example:
 *               message: Sucessfully Updated the password.
 */
// router.post("/candidate/login",passport.authenticate("local"),candidateLogin)
router.get("/candidate/jobs",isAuthenticatedCandidate,candidategetJobs)
/**
 * @swagger
 * /candidate/jobs:
 *   get:
 *     tags:
 *       - Candidate
 *     parameters: 
 *      - name: page
 *        in: query
 *        description: page 
 *      - name: size
 *        in: query 
 *        description: size
 *     summary: Get Jobs Listed By Recruiter.
 *     description: Returns a list of jobs that listed by all the recruiters if the candidate is logged in else it will should "you need to log in".
 *     responses:
 *       '200':
 *         description: A successful response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: list of jobs
 *             example:
 *               message: {"id":1,"title":hello,"description":World,"recruiter_id":1}
 */




router.get("/candidate/applyjob/:id",isAuthenticatedCandidate,candidateAppliedJobs)
/**
 * @swagger
 * /candidate/applyjob/{id}:
 *   get:
 *     tags:
 *       - Candidate
 *     summary: Apply for a job.
 *     description: it will apply for all the job if the job_id exist and send the mail to candidate and recruiter.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The id for the job.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: apply a job.
 *             example:
 *               message: "Sucessfully Applied"
 */

router.get("/candidate/showapplied",isAuthenticatedCandidate,candidateShowAppliedJobs)
/**
 * @swagger
 * /candidate/showapplied:
 *   get:
 *     tags:
 *       - Candidate
 *     summary: List of all Applied Jobs By Candidate.
 *     description: Returns all the applied jobs of candidate , if the candidate is logged in.
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: list of applied jobs.
 *             example:
 *               message: {"firstName":"hello","lastName":"world","title":"hi","description":"hello"}
 */

// router.get("/getusers/:id",isAuthenticated,getUser)


//For Recruiters

// router.post("/recruiter/login",passport.authenticate("local"),recruiterLogin)


router.post("/recruiter/addjob",isAuthenticatedRecruiter,jobAdd)
/**
 * @swagger
 * /recruiter/addjob:
 *   post:
 *     tags:
 *       - Recruiter
 *     summary: Post a job.
 *     description: Recruiter will able to post a job with title,description and it will automatically add recruiter_id if the recruiter is logged in.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title for the job.
 *               description:
 *                 type: string
 *                 description: The description for the job.
 *             required:
 *               - title
 *               - description
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: post a job for the candidate.
 *             example:
 *               message: Job Added.
 */
router.post("/recruiter/resetpassword",resetPasswordForRecruiter)
/**
 * @swagger
 * /recruiter/resetpassword:
 *   post:
 *     tags:
 *       - Recruiter
 *     summary: Password Resetter for Recruiter.
 *     description: It Will Take the req.body as email and verify if that email exists , if exist then send an email to the recruiter with a token .
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the recruiter.
 *             required:
 *               - email
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: reset password for the Recruiter.
 *             example:
 *               message: Token Sent to your email.
 */
router.post("/recruiter/resetpassword/:token",resetPasswordBytokenForRecruiter)
/**
 * @swagger
 * /recruiter/resetpassword/{token}:
 *   post:
 *     tags:
 *       - Recruiter
 *     summary: Password Update for recruiter.
 *     description: it will first verify the token from the params and if the token is same as sent to recruiter email then it will update the candidate password.
 *     parameters:
 *       - name: token
 *         in: path
 *         description: The token for resetting password.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the recruiter.
 *               password:
 *                 type: string
 *                 description : The password of the recruiter.
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: reset password for the Recruiter via token.
 *             example:
 *               message: Sucessfully Updated the password.
 */

router.get("/recruiter/viewjobs",isAuthenticatedRecruiter,recruiterViewJobs)
/**
 * @swagger
 * /recruiter/viewjobs:
 *   get:
 *     tags:
 *       - Recruiter
 *     parameters: 
 *      - name: page
 *        in: query
 *        description: page 
 *      - name: size
 *        in: query 
 *        description: size
 *     summary: Get Jobs Applied By Candidate.
 *     description: Returns a list of jobs that applied by all the candidates if the recruiter is logged in else it will should "you need to log in".
 *     responses:
 *       '200':
 *         description: A successful response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: list of jobs
 *             example:
 *               message: {"title":"test","description":"test2","candidate_id":1}
 */

//For Login Candidate and Recruiter
router.post("/login",passport.authenticate("local"),welcome)
/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login for all the candidates,recruiters & admin.
 *     description: Login Api for authenticating all recruiters, admin and candidates for authorizing some routes.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the candidate.
 *               password:
 *                 type: string
 *                 description: The password of the candidate.
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: login for the user.
 *             example:
 *               message: Welcome Test
 */

router.get("/logout",logout)
/**
 * @swagger
 * /logout:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Logout Route for Candidates , Recruiters & Admin.
 *     description: Logout all the user , which is currently using the api.
 *     responses:
 *       '200':
 *         description: A successful response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Logout User.
 *             example:
 *               message: Logout Sucessfully.
 */


//Admin Routes
router.post("/admin/recruiter/register",isAuthenticatedAdmin,adminRecruiter)
/**
 * @swagger
 * /admin/recruiter/register:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Register Recruiter.
 *     description: Register the Recruiter with their firstName lastName email & password using only special password (8 characters long must have atleast one uppercase,lowercase,numeric & special character), if the admin is logged in else admin need to looged in for registering a recruiter.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The first name of the recruiter.
 *               lastName:
 *                 type: string
 *                 description : the last name of the recruiter.
 *               email:
 *                 type: string
 *                 description: The email of the recruiter.
 *               password:
 *                 type: string
 *                 description: The password of the recruiter.
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Register recruiter.
 *             example:
 *               message: "Registered Sucessfully"
 */

router.get("/admin/delete/recruiter/:id",isAuthenticatedAdmin,deleteRecruiter)
/**
 * @swagger
 * /admin/delete/recruiter/{id}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Remove a Recruiter.
 *     description: Admin can remove a recruiter with their recruiter_id if admin is logged in. 
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The id for the recruiter.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: remove a recruiter.
 *             example:
 *               message: "Sucessfully Deleted a recruiter"
 */

router.post("/admin/update/recruiter/:id",isAuthenticatedAdmin,updateRecruiter)
/**
 * @swagger
 * /admin/update/recruiter/{id}:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Modify a recruiter.
 *     description: it will take a recruiter_id in params check whether the recruiter exist, if exist then update their firstName and lastName , if the admin is logged in.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The id of recruiter.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The first name of the recruiter.
 *               lastName:
 *                 type: string
 *                 description : The last name  of the recruiter.
 *             required:
 *               - firstName
 *               - lastName
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: update recruiter.
 *             example:
 *               message: Sucessfully Updated a recruter.
 */
router.get("/admin/deletejob/:id",isAuthenticatedAdmin,deleteJob)
/**
 * @swagger
 * /admin/deletejob/{id}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Remove a Job.
 *     description: Admin can remove a Job with their job_id if admin is logged in. 
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The id for the job.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: remove a job.
 *             example:
 *               message: "Sucessfully Deleted a Job"
 */
router.get("/admin/jobs",isAuthenticatedAdmin,allJobs)
/**
 * @swagger
 * /admin/jobs:
 *   get:
 *     tags:
 *       - Admin
 *     parameters: 
 *      - name: page
 *        in: query
 *        description: page 
 *      - name: size
 *        in: query 
 *        description: size
 *     summary: Get All Posted Jobs.
 *     description: Returns a list of Posted Jobs ,posted by all recruiters .if the admin is logged in else it will should "you need to log in".
 *     responses:
 *       '200':
 *         description: A successful response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: list of posted jobs.
 *             example:
 *               message: {"id":1,"title":hello,"description":World,"recruiter_id":1}
 */
router.get("/admin/recruiters",isAuthenticatedAdmin,allRecruiters)
/**
 * @swagger
 * /admin/recruiters:
 *   get:
 *     tags:
 *       - Admin
 *     parameters: 
 *      - name: page
 *        in: query
 *        description: page 
 *      - name: size
 *        in: query 
 *        description: size
 *     summary: Get All Recruiters.
 *     description: Returns a list of all recruiters .if the admin is logged in else it will should "you need to log in".
 *     responses:
 *       '200':
 *         description: A successful response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: list of recruiters.
 *             example:
 *               message: {"id":1,"firstName":hello,"lastName":World,"email":test@gmail.com,"password":"123"}
 */
router.get("/admin/candidates",isAuthenticatedAdmin,allCandidates)
/**
 * @swagger
 * /admin/candidates:
 *   get:
 *     tags:
 *       - Admin
 *     parameters: 
 *      - name: page
 *        in: query
 *        description: page 
 *      - name: size
 *        in: query 
 *        description: size
 *     summary: Get All Registered Candidates.
 *     description: Returns a list of registered candidates .if the admin is logged in else it will should "you need to log in".
 *     responses:
 *       '200':
 *         description: A successful response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: list of candidates.
 *             example:
 *               message: {"id":1,"firstName":hello,"lastName":World,"email":test@gmail.com,"password":"123"}
 */
router.get("/admin/candidate/jobs",isAuthenticatedAdmin,candidateJobs)
/**
 * @swagger
 * /admin/candidate/jobs:
 *   get:
 *     tags:
 *       - Admin
 *     parameters: 
 *      - name: page
 *        in: query
 *        description: page 
 *      - name: size
 *        in: query 
 *        description: size
 *     summary: Get All Applied Jobs by every Candidates.
 *     description: Returns a list of all applied jobs by every candidates .if the admin is logged in else it will should "you need to log in".
 *     responses:
 *       '200':
 *         description: A successful response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: list of applied jobs.
 *             example:
 *               message: {"title":"test","description":"test","candidate_id":1}
 */
router.get("/admin/delete/candidate/:id",isAuthenticatedAdmin,removeCandidate)
/**
 * @swagger
 * /admin/delete/candidate/{id}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Remove a Candidate.
 *     description: Admin can remove a candidate with their candidate_id if admin is logged in. 
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The id for the candidate.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: remove a candidate.
 *             example:
 *               message: "Sucessfully Deleted a candidate"
 */
router.get("/admin/exportall",isAuthenticatedAdmin,exportAll)
/**
 * @swagger
 * /admin/exportall:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Export all the data.
 *     description: Export all the records like all candidates,recruiter and applied jobs by candidate in an excel file.
 *     responses:
 *       '200':
 *         description: A successful response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: export data.
 *             example:
 *               message: exported all the data.
 */










module.exports=router