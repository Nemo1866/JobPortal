const {recruiter, jobsList} = require('../connection')

module.exports={
    welcomePage: (req,res)=>{
        res.send(`Welcome ${req.user.dataValues.firstName}`)
    },
    recruiterLogin:(req,res)=>{
        res.send(`Welcome`)
    },
    adminRecruiter: async (req,res) => {
        const newRecruiter = await recruiter.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        })
        res.send('New Recruiter Added')
    },jobAdd:async (req,res) => {
        const newJob = await jobsList.create({
         title: req.body.title,
         description: req.body.description
        })
        const recid = req.user.dataValues.id
        const user = await recruiter.findOne({where: {id: recid}})   
        const jobAdded = await user.addJobsList(newJob);
        res.send('New Job Added')
      },recruiterLogout: (req,res) => {
        req.logout((err)=>{
            if(err) res.send('This Didnt Work')
            else res.send('Get Lost')
        })
      }

}