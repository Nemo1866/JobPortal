const express=require("express")
const router = require("./route/router")
const app=express()
const passport=require("passport")
const session=require("express-session")
const swaggerUI=require("swagger-ui-express")
const { passportInitializa } = require("./passport/candidateConfig")
const swaggerSpec = require("./swaggerConfig")
// const {initializingPassport}=require("./passport/recruiterConfig")
require("./connection")

app.use(express.json())
app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(swaggerSpec))
passportInitializa(passport)
// initializingPassport(passport)
app.use(session({
    secret:"secret",
    saveUninitialized:false,
    resave:false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use("/",router)


app.listen(3000,()=>{
    console.log("Sucessfully running on port 3000");
})