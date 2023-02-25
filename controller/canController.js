require("dotenv").config()
const {Candidate, jobsList, appliedJobs, recruiter, sequelize}=require("../connection")
const joi=require("joi")
const nodemailer=require("nodemailer")
const jwt=require("jsonwebtoken")
const {google}=require("googleapis")

const schema=joi.object({
    firstName:joi.string().required(),
    lastName:joi.string().required(),
    email:joi.string().required(),
    password:joi.string().pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')).required().messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character, and be at least 8 characters long'
      })
})
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

    createUser:async(req,res)=>{
        try {
            const {firstName,lastName,email,password}=req.body

        const done=await schema.validateAsync(req.body)
       
        const check=await Candidate.findOne({where:{email}})
        if(check){
         
            res.json({
                msg:"User Already Exist"
            })
        }
        
       
     
        
    let result=await Candidate.create({firstName,lastName,email,password})
  if(result){
    mail("Welcome To MyJobs","Dear Candidate,Thanks for joining MYJobs",`Welcome ${firstName} ${lastName} to our website`,email)
    res.json({
        message:"Saved in the database"
    })
}else{
    res.json({
        message:"Some Error Occured"
    })
}

            
        } catch (error) {
            console.log(error);
         
        }
        

    },
    resetPasswordForCandidate:async(req,res)=>{
        const {email}=req.body
        const candidate=await Candidate.findOne({where:{email}})
        if(!candidate){
            res.json({
                msg:"Email Account Doesn't Exist"
            })
        }else{
            
            let secret=candidate.password + "THis is our little Secret."
            let payload={
                id:candidate.id,
                email:candidate.email
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
                to:candidate.email,
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
    },
    resetPasswordBytokenForCandidate:async(req,res)=>{
        const {token}=req.params
        const {email,password}=req.body
        const candidate=await Candidate.findOne({where:{email}})

        const secret=candidate.password + "THis is our little Secret."
        jwt.verify(token,secret,async (err)=>{
            if(err){
                res.json({
                    msg:"invalid Token"
                })
            }else{
                let candidate=await Candidate.update({password:password},{where:{
                    email:email
                }})
                let candidate2=await Candidate.findOne({where:{email}})
                mail("Updated Your Password",`Your Password Has been Updated.`,`Hello,${candidate2.first_name} ${candidate2.last_name} Thanks for choosing MyJobs,Your Password Has been Updated.`,email)
                res.json({
                    msg:"Sucessfully Updated the Password"
                })
            }
        })
        

    },candidateLogin:async(req,res)=>{
        let jobs=await jobsList.findAll()
        res.json({msg:jobs})
    },candidateLogout:async(req,res)=>{
        req.logout(err=>{
            if(err){
                res.json({
                    msg:err
                })
            }else{
                res.json({
                    msg:"Sucessfully Logout"
                })
            }
        })
    },candidateAppliedJobs:async(req,res)=>{
        let find=await jobsList.findOne({where:{id:req.params.id}})
        let result=await appliedJobs.create({
            candidateId:req.user.dataValues.id,
            jobsListId:req.params.id,
            recruiterId:find.recruiterId


        })
        if(!result){
            res.json({msg:"Could not apply for this job "})
        }else{
            let candidate=await Candidate.findOne({where:{id:req.user.dataValues.id}})
            let recruiter1=await recruiter.findOne({where:{id:result.recruiterId}})
            let jobs=await jobsList.findOne({where:{id:req.params.id}})
            mail(`Thanks for Applying in our Myjobs Portal`,`Applied For ${jobs.title}`,`Thanks for Applying for the position of ${jobs.title}. I hope that you get selected for this job`,[candidate.email,recruiter1.email])


        res.json({
            msg:"Sucessfully Applied"
        })
    }
    },candidateShowAppliedJobs:async(req,res)=>{
        // let result=await appliedJobs.findAll({ where:{candidateId:req.user.dataValues.id},order:[["createdAt","DESC"]]});
        let result= await sequelize.query(`Select title,description,ap.createdAT from appliedjobs ap left join jobslists on ap.jobsListId=jobslists.id where ap.candidateId=${req.user.dataValues.id} order by createdAt desc`)
     
       
        if(result){
            res.json({result:result })
        }else{
            res.json({
                msg:"You've Not Applied for any jobs"
            })
        }
    },getUser:async(req,res)=>{
        let candidate=await Candidate.findOne({where:{id:req.params.id},include:jobsList})
        res.json({candidate:candidate})
    }
}



