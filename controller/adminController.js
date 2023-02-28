const {
  jobsList,
  recruiter,
  Candidate,
  appliedJobs,
} = require("../connection");
const XLSX = require("xlsx");
module.exports = {
  deleteRecruiter: async (req, res) => {
    try {
      const deleted = await recruiter.destroy({ where: { id: req.params.id } });
      if (!deleted) {
        res.send("Could Not Delete the Recruiter");
      } else {
        res.json({
          msg: " Recruiter has been successfully deleted from the database",
        });
      }
    } catch (error) {
      res.send(error);
    }
  },
  updateRecruiter: async function (req, res) {
    try {
      const { id } = req.params;

      const { firstName, lastName } = req.body;
      let updatedRecruiter = await recruiter.update(
        { firstName, lastName },
        { where: { id } }
      );
      if (!updatedRecruiter) {
        res.send("Could Not Update the recruiter");
      } else {
        res.json({
          msg: "Sucessfully Updated the Recruiter",
        });
      }
    } catch (error) {
      res.send(error);
    }
  },
  deleteJob: async (req, res) => {
    try {
      const job = await jobsList.findOne({ where: { id: req.params.id } });
      const deleted = await jobsList.destroy({ where: { id: req.params.id } });
      res.send(job.title + " has been successfully deleted from the database");
    } catch (error) {
      res.send(error);
    }
  },
  allCandidates: async (req, res) => {
    try {
      let pageNumber=Number.parseInt(req.query.page)
      let sizeNumber=Number.parseInt(req.query.size)

      let page=0
      if(typeof Number(pageNumber)&&(pageNumber)>0){
          page=pageNumber
      }

      let size=10
      if(typeof Number(sizeNumber) && (sizeNumber)>0 && sizeNumber<10){
          size=sizeNumber
      }
      let result = await Candidate.findAndCountAll({limit:size,offset:page*size});

      if (!result) {
        res.json({
          msg: "Could Not Find Any Candidate",
        });
      } else {
        
        res.json({
          msg: result,
          totalPage:Math.ceil(result.count/size)
        });
      }
    } catch (error) {
      res.send(error);
    }
  },
  allRecruiters: async (req, res) => {
    try {
      let pageNumber=Number.parseInt(req.query.page)
      let sizeNumber=Number.parseInt(req.query.size)

      let page=0
      if(typeof Number(pageNumber)&&(pageNumber)>0){
          page=pageNumber
      }

      let size=10
      if(typeof Number(sizeNumber) && (sizeNumber)>0 && sizeNumber<10){
          size=sizeNumber
      }
      let result = await recruiter.findAndCountAll({limit:size,offset:page*size});
      if (!result) {
        res.json({
          msg: "Could Not Find Any Recruiter",
        });
      } else {
        res.json({
          msg: result,
          totalPage:Math.ceil(result.count/size)
        });
      }
    } catch (error) {
      res.send(error);
    }
  },
  allJobs: async (req, res) => {
    try {
      let pageNumber=Number.parseInt(req.query.page)
      let sizeNumber=Number.parseInt(req.query.size)

      let page=0
      if(typeof Number(pageNumber)&&(pageNumber)>0){
          page=pageNumber
      }

      let size=10
      if(typeof Number(sizeNumber) && (sizeNumber)>0 && sizeNumber<10){
          size=sizeNumber
      }
      let result = await jobsList.findAndCountAll({limit:size,offset:page*size});
      if (!result) {
        res.json({
          msg: "Could Not Find Any Jobs",
        });
      } else {
        res.json({
          msg: result,
          totalPage:Math.ceil(result.count/size)
        });
      }
    } catch (error) {
      res.send(error);
    }
  },
  candidateJobs: async (req, res) => {
    try {
      let result = await appliedJobs.findAll();
      if (!result) {
        res.json({ msg: "Could Not find any candidate with a job" });
      } else {
        res.json({
          msg: result,
        });
      }
    } catch (error) {
      res.send(error);
    }
  },
  removeCandidate: async (req, res) => {
    try {
      let { id } = req.params;
      let result = await Candidate.destroy({ where: { id } });
      if (!result) {
        res.json({ msg: "Could Not Delete this Candidate" });
      } else {
        res.json({
          msg: "Sucessfully Deleted The Candidate",
        });
      }
    } catch (error) {
      res.send(error);
    }
  },
  exportAll: async (req, res) => {
    try {
      let candidate=await Candidate.findAll()
      let Recruiter=await recruiter.findAll()
      let CandidateJobs=await appliedJobs.findAll()

      let candidateData=candidate.map((candidate)=>candidate.toJSON())
      let recruiterData=Recruiter.map((recruiter)=>recruiter.toJSON())
      let jobsData=CandidateJobs.map((jobs)=>jobs.toJSON())

      let candidateSheet=XLSX.utils.json_to_sheet(candidateData)
     
      let recruiterSheet=XLSX.utils.json_to_sheet(recruiterData)
  
      let appliedJobSheet=XLSX.utils.json_to_sheet(jobsData)
  

      let CandidateWorkSheet=XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(CandidateWorkSheet,candidateSheet,'Candidate')
  

      let RecruiterWorkSheet=XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(RecruiterWorkSheet,recruiterSheet,'Recruiter')
     


      let JobWorkSheet=XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(JobWorkSheet,appliedJobSheet,'Applied Jobs')
    

     XLSX.writeFile(CandidateWorkSheet,'candidate.xlsx')
   

 XLSX.writeFile(RecruiterWorkSheet,'recruiter.xlsx')
      

    XLSX.writeFile(JobWorkSheet,'appliedJobs.xlsx')
   

      res.json({
        msg:"Sucessfully Exported All the Data"
      })


    } catch (error) {
console.log(error);
    }
  },
};
