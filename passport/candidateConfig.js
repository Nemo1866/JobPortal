const localStrategy=require("passport-local")
const { Candidate, recruiter,Admin } = require("../connection")
const {compare}=require("bcrypt")

exports.passportInitializa=(passport)=>{
passport.use(new localStrategy({usernameField:"email",passwordField:"password"},async function(email,password,done){
    try {
        let user=null
        let candidate=await Candidate.findOne({where:{email: email}})
        let recruiter2=await recruiter.findOne({where:{email: email}})
        // console.log(recruiter2)
        if(candidate){
          user=candidate
     
        }else if(recruiter2){
           
            user=recruiter2
         
        }else{
            let admin=await Admin.findOne({where:{email}})
            user=admin
        }
if(!user){
     return done("Email Address Does Not Exist",false)
}
let hashPassword=await compare(password,user.password)
if(!hashPassword){
    done("Password is incorrect",false)
}
done(null,user)
        
    } catch (error) {
        done(error,false)
    }

}))

passport.serializeUser((user,done)=>{
    done(null,user.email)
})
passport.deserializeUser(async(email,done)=>{
try {
let user=null
let candidate=await Candidate.findOne({where:{email}})
let recruiter2=await recruiter.findOne({where:{email}})
let admin=await Admin.findOne({where:{email}})
if(candidate){
    user=candidate
}else if(recruiter2){
    user=recruiter2
}else{
    user=admin
}
done(null,user)
} catch (error) {
done(error,false)
}
})
}


exports.isAuthenticatedCandidate = async(req,res,next) =>{
    if(!req.user){
        return res.send("You're not logged in")
    }

    let candidate=req.user.dataValues.email
    let exists=await Candidate.findOne({where:{email:candidate}})
    if(exists) return next()
    res.status(404).send(`${req.user.dataValues.firstName} ${req.user.dataValues.lastName} is not an Candidate`)
}

exports.isAuthenticatedRecruiter=async(req,res,next)=>{
    if(!req.user){
        return res.send("You're not logged in")
    }
    let recruiter1=req.user.dataValues.email
    let exists=await recruiter.findOne({where:{email:recruiter1}})
    if(exists) return next()
    res.status(404).send(`${req.user.dataValues.firstName} ${req.user.dataValues.lastName} is not an Recruiter`)
}

exports.isAuthenticatedAdmin = async (req,res,next) =>{
    if(!req.user) return res.status(401).send('You must be logged in')
    const adminn = req.user.dataValues.email
    const exists = await Admin.findOne({where: {email: adminn}})

   
    if(exists) return next()
    res.status(404).send(req.user.dataValues.firstName +" is Not a Admin")
}
