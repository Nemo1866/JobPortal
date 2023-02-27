const {jobsList,recruiter}=require("../connection")
module.exports={
  
      deleteRecruiter : async (req,res) => {
       
        const deleted = await recruiter.destroy({where: {id: req.params.id}})
        if(!deleted){
            res.send("Could Not Delete the Recruiter")
        }else{
            const recruiterr = await recruiter.findOne({where: {id: req.params.id}})
            res.json({msg:`${recruiterr.firstName} ${recruiterr.lastName}+" has been successfully deleted from the database"`}) 
        }
      },
      updateRecruiter: async function (req, res){
        const { id } = req.params; 
        const { firstName, lastName } = req.body; 
        let updatedRecruiter= await recruiter.update({ firstName, lastName },{ where: { id } })
        if(!updatedRecruiter){
            res.send("Could Not Update the recruiter")
        }else{
       res.json({
        msg:"Sucessfully Updated the Recruiter"
       })
        }
      },
      deleteJob : async (req,res) => {

        const job = await jobsList.findOne({where: {id: req.params.id}})
        const deleted = await jobsList.destroy({where: {id: req.params.id}})
        res.send(job.title +" has been successfully deleted from the database") 
      }
}