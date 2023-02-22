const bcrypt=require("bcrypt")

module.exports=(sequelize,DataTypes)=>{
let Candidate=sequelize.define("candidate",{
    first_name:{
        type:DataTypes.STRING,
        allowNull:false
    },last_name:{
        type:DataTypes.STRING,
        allowNull:false
    },email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
        validate:{
isEmail:{
    message:"Please Provide a valid email String"
}
        }
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false,
        set(value){
            let salt=bcrypt.genSaltSync(10)
            let password=bcrypt.hashSync(value,salt)
         this.setDataValue('password',password)
           

        }
    },
},{
    timestamps:false,
    createdAt:true
})
return Candidate
}