const {recruiter, jobsList, appliedJobs} = require('../connection')
const nodemailer=require("nodemailer")
const {google}=require("googleapis")
const jwt=require("jsonwebtoken")

const oAuthGoogleClient=new google.auth.OAuth2(process.env.CLIENT_ID,process.env.CLIENT_SECRET,process.env.REDIRECT_URI)
oAuthGoogleClient.setCredentials({refresh_token:process.env.REFRESH_TOKEN})
function mail(title,subject,body,email){
    let accessToken= oAuthGoogleClient.getAccessToken()

    let transport=nodemailer.createTransport({
        service:"gmail",
        auth:{
type:"OAuth2",
user:process.env.USER,
clientId:process.env.CLIENT_ID,
clientSecret:process.env.CLIENT_SECRET,
refreshToken:process.env.REFRESH_TOKEN,
accessToken:accessToken
        }
    })
    let mailOptions={
        from:`${title}  <${process.env.USER}>`,
        to:email,
        subject:subject,
       
        text:"Checking ",
        html:body
    }
    transport.sendMail(mailOptions,(err)=>{
        if(err){
            res.json({ msg:"Some Error Occured"})
        }else{
            res.json({
                msg:"Sucessfully Sent to your email"
            })
        }
    })
}

module.exports={
    welcomePage: (req,res)=>{
        res.send(`Welcome ${req.user.dataValues.firstName}`)
    },
    recruiterLogin:(req,res)=>{
        res.send(`Welcome`)
    },
    adminRecruiter: async (req,res) => {
        const newRecruiter = await recruiter.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        })
        if(!newRecruiter){
            res.json({
                msg:"Could Not Add The Recruiter"
            })
        }else{
            mail("Welcome To MyJobs.","You've Been Assigned As a new recruiter",`Dear ${req.body.firstName}, We Have Sucessfully Assigned As Our New Recruiter . Add Some New Jobs and make our site more popular `,req.body.email)
            res.json({
                msg:"New Recruiter Added"
            })
        }
    },jobAdd:async (req,res) => {
        const newJob = await jobsList.create({
         title: req.body.title,
         description: req.body.description
        })
        const recid = req.user.dataValues.id
        const user = await recruiter.findOne({where: {id: recid}})   
        const jobAdded = await user.addJobsList(newJob);
        res.send('New Job Added')
      },recruiterLogout: (req,res) => {
        req.logout((err)=>{
            if(err) res.send('This Didnt Work')
            else res.send('Get Lost')
        })
      },resetPasswordForRecruiter:async(req,res)=>{
        const {email}=req.body
        const recruiterr=await recruiter.findOne({where:{email}})
        if(!recruiterr){
            res.json({
                msg:"Email Account Doesn't Exist"
            })
        }else{
            
            let secret=recruiterr.password + "THis is our little Secret."
            let payload={
                id:recruiterr.id,
                email:recruiterr.email
            }
            let token=jwt.sign(payload,secret,{expiresIn:"15m"})
            let accessToken=await oAuthGoogleClient.getAccessToken()

            let transport=nodemailer.createTransport({
                service:"gmail",
                auth:{
type:"OAuth2",
user:process.env.USER,
clientId:process.env.CLIENT_ID,
clientSecret:process.env.CLIENT_SECRET,
refreshToken:process.env.REFRESH_TOKEN,
accessToken:accessToken
                }
            })
            let mailOptions={
                from:`OTP FOR Changing Password  <${process.env.USER}>`,
                to:recruiterr.email,
                subject:"One Time Password",
               
                text:"Checking ",
                html:`http://localhost:3000/resetpassword/${token}`
            }
            transport.sendMail(mailOptions,(err)=>{
                if(err){
                    res.json({
                        msg:"Some Error Occured"+err
                    })
                }else{
                    res.json({
                        msg:"Sucessfully Sent to your email"
                    })
                }
            })

        }
    }, resetPasswordBytokenForRecruiter:async(req,res)=>{
        const {token}=req.params
        const {email,password}=req.body
        const recruiterr=await recruiter.findOne({where:{email}})

        const secret=recruiterr.password + "THis is our little Secret."
        jwt.verify(token,secret,async (err)=>{
            if(err){
                res.json({
                    msg:"invalid Token"
                })
            }else{
                let recruiterr=await recruiter.update({password:password},{where:{
                    email:email
                }})
                let recruiter1=await recruiter.findOne({where:{email}})
                mail("Updated Your Password",`Your Password Has been Updated.`,`Hello,${recruiter1.first_name} ${recruiter1.last_name} Thanks for choosing MyJobs,Your Password Has been Updated.`,email)
                res.json({
                    msg:"Sucessfully Updated the Password"
                })
            }
        })
        

    },recruiterViewJobs:async(req,res)=>{
        let result = await appliedJobs.findAll({
            where:{recruiterId:req.user.dataValues.id},
            order: [["createdAt", "DESC"]],
          });
        if(!result){
            res.json({
                msg:`${req.user.dataValues.firstName} ${req.user.dataValues.firstName} you don't have any jobs posted.`
            })
        }else{
            res.json({
                msg:result
            })
        }
    }

}