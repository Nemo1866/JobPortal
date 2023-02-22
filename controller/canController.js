const {Candidate}=require("../connection")
const joi=require("joi")

const schema=joi.object({
    first_name:joi.string().required(),
    last_name:joi.string().required(),
    email:joi.string().required(),
    password:joi.string().pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')).required().messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character, and be at least 8 characters long'
      })
})

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
        

    }
}
