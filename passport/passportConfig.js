const localStrategy=require("passport-local")
const { Candidate } = require("../connection")
const {compare}=require("bcrypt")

exports.passportInitializa=(passport)=>{
passport.use(new localStrategy({usernameField:"email",passwordField:"password"},async function(username,password,done){
    try {
        let candidate=await Candidate.findOne({where:{email:username}})
if(!candidate){
     return done("Email Address Does Not Exist",false)
}
let hashPassword=await compare(password,candidate.password)
if(!hashPassword){
    done("Password is incorrect",false)
}
done(null,candidate)
        
    } catch (error) {
        done(error,false)
    }

}))

passport.serializeUser((user,done)=>{
    done(null,user.id)
})
passport.deserializeUser(async(id,done)=>{
try {
let candidate=await Candidate.findOne({where:{id}})
done(null,candidate)
} catch (error) {
done(error,false)
}
})
}
