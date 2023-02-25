const localStrategy=require("passport-local")
const { Candidate, recruiter } = require("../connection")
const {compare}=require("bcrypt")

exports.passportInitializa=(passport)=>{
passport.use(new localStrategy({usernameField:"email",passwordField:"password"},async function(username,password,done){
    try {
        let candidate=await Candidate.findOne({where:{email:username}})
        let recruiter2=await recruiter.findOne({where:{email:username}})
        let user=null
        if(candidate){
          user=candidate
        }else{
            user=recruiter2
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
    done(null,user.id)
})
passport.deserializeUser(async(id,done)=>{
try {
let user=null
let candidate=await Candidate.findOne({where:{id}})
let recruiter2=await recruiter.findOne({where:{id}})
if(candidate){
    user=candidate
}else{
    user=recruiter2
}


done(null,user)
} catch (error) {
done(error,false)
}
})
}
