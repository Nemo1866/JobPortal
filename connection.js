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
sequelize.sync()

module.exports={Candidate}