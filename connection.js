const {Sequelize,DataTypes}=require("sequelize")
const {hashSync,hash}=require("bcrypt")
const sequelize=new Sequelize("jobsPortal","root","nimap123",{
    host:"localhost",
    dialect:"mysql"
})

sequelize.authenticate().then(()=>{
    console.log("Db Connected");
}).catch(err=>{
    console.log(err);
})

let Candidate=require("./models/candidate")(sequelize,DataTypes)
let recruiter = require('./models/recruiter')( sequelize, DataTypes)
let jobsList = require('./models/jobsList')( sequelize, DataTypes)
let appliedJobs=require("./models/appliedJobs")(sequelize,DataTypes)
let Admin=require("./models/admin")(sequelize,DataTypes)


recruiter.hasMany(jobsList)
jobsList.belongsTo(recruiter)


Candidate.belongsToMany(jobsList,{through:appliedJobs})
jobsList.belongsToMany(Candidate,{through:appliedJobs})
recruiter.belongsToMany(jobsList,{through:appliedJobs})





sequelize.sync()
// .then(()=>{
//     return Admin.create({firstName:"Ahmed",lastName:"Shaikh",email:"ahmedsagir@nimapinfotech.com",password:"Ahmed@786"})
// }).then((data)=>{
//     console.log(data);
// }).catch((error)=>{
//     console.log(error);
// })

module.exports={Candidate,recruiter,jobsList,appliedJobs,sequelize,Admin}