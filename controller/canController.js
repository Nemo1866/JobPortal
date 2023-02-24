require("dotenv").config()
const {Candidate}=require("../connection")
const joi=require("joi")
const nodemailer=require("nodemailer")
const jwt=require("jsonwebtoken")
const {google}=require("googleapis")

const schema=joi.object({
    first_name:joi.string().required(),
    last_name:joi.string().required(),
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
            const {first_name,last_name,email,password}=req.body

        const done=await schema.validateAsync(req.body)
       
        const check=await Candidate.findOne({where:{email}})
        if(check){
         
            res.json({
                msg:"User Already Exist"
            })
        }
        
       
     
        
    let result=await Candidate.create({first_name,last_name,email,password})
  if(result){
    mail("Welcome To MyJobs","Dear Candidate,Thanks for joining MYJobs",`Welcome ${first_name} ${last_name} to our website`,email)
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
    resetPassword:async(req,res)=>{
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
    resetPasswordBytoken:async(req,res)=>{
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
        

    }
}



