const { recruiter, jobsList, appliedJobs } = require("../connection");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const jwt = require("jsonwebtoken");

const joi=require("joi");
const { pagination } = require("../pagination");

const schema=joi.object({
    firstName:joi.string().required(),
    lastName:joi.string().required(),
    email:joi.string().required(),
    password:joi.string().pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')).required().messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character, and be at least 8 characters long'
      })
})
const schemaPassword=joi.object({
  password:joi.string().pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')).required().messages({
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character, and be at least 8 characters long'
  })
})


const oAuthGoogleClient = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
oAuthGoogleClient.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
function mail(title, subject, body, email) {
  let accessToken = oAuthGoogleClient.getAccessToken();

  let transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.USER,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });
  let mailOptions = {
    from: `${title}  <${process.env.USER}>`,
    to: email,
    subject: subject,

    text: "Checking ",
    html: body,
  };
  transport.sendMail(mailOptions, (err) => {
    if (err) {
      res.json({ msg: "Some Error Occured" });
    } else {
      res.json({
        msg: "Sucessfully Sent to your email",
      });
    }
  });
}

module.exports = {

  adminRecruiter: async (req, res) => {
    try {
        const {firstName,lastName,email,password}=req.body

        const check=await schema.validateAsync(req.body)
       
      const newRecruiter = await recruiter.create({
       firstName,lastName,email,password
      });
      if (!newRecruiter) {
        res.json({
          msg: "Could Not Add The Recruiter",
        });
      } else {
        mail(
          "Welcome To MyJobs.",
          "You've Been Assigned As a new recruiter",
          `Dear ${req.body.firstName}, We Have Sucessfully Assigned As Our New Recruiter . Add Some New Jobs and make our site more popular `,
          req.body.email
        );
        res.json({
          msg: "New Recruiter Added",
        });
      }
    } catch (error) {
       res.send("You Need to Provide atleast Eight Character with atleast 1 UpperCase,1 LowerCase,1 Special Character and 1 Numeric Character")
    }
  },
  jobAdd: async (req, res) => {
    try {
      const newJob = await jobsList.create({
        title: req.body.title,
        description: req.body.description,
      });
      const recid = req.user.dataValues.id;
      const user = await recruiter.findOne({ where: { id: recid } });
      const jobAdded = await user.addJobsList(newJob);
      res.send("New Job Added");
    } catch (error) {
      res.send(error);
    }
  },
  recruiterLogout: (req, res) => {
    req.logout((err) => {
      if (err) res.send("This Didnt Work");
      else res.send("Logout Sucessfully");
    });
  },
  resetPasswordForRecruiter: async (req, res) => {
    try {
      const { email } = req.body;
      const recruiterr = await recruiter.findOne({ where: { email } });
      if (!recruiterr) {
        res.json({
          msg: "Email Account Doesn't Exist",
        });
      } else {
        let secret = recruiterr.password + "THis is our little Secret.";
        let payload = {
          id: recruiterr.id,
          email: recruiterr.email,
        };
        let token = jwt.sign(payload, secret, { expiresIn: "15m" });
        let accessToken = await oAuthGoogleClient.getAccessToken();

        let transport = nodemailer.createTransport({
          service: "gmail",
          auth: {
            type: "OAuth2",
            user: process.env.USER,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: accessToken,
          },
        });
        let mailOptions = {
          from: `OTP FOR Changing Password  <${process.env.USER}>`,
          to: recruiterr.email,
          subject: "One Time Password",

          text: "Checking ",
          html: `http://localhost:3000/recruiter/resetpassword/${token}`,
        };
        transport.sendMail(mailOptions, (err) => {
          if (err) {
            res.json({
              msg: "Some Error Occured" + err,
            });
          } else {
            res.json({
              msg: "Sucessfully Sent to your email",
            });
          }
        });
      }
    } catch (error) {
      res.send(error);
    }
  },
  resetPasswordBytokenForRecruiter: async (req, res) => {
    try {
      const { token } = req.params;
      const { email, password } = req.body;
      const recruiterr = await recruiter.findOne({ where: { email } });

      const secret = recruiterr.password + "THis is our little Secret.";
      jwt.verify(token, secret, async (err) => {
        if (err) {
          res.json({
            msg: "invalid Token",
          });
        } else {
          
        let check=await schemaPassword.validateAsync({password})
          let recruiterr = await recruiter.update(
            { password: password },
            {
              where: {
                email: email,
              },
            }
          );
          let recruiter1 = await recruiter.findOne({ where: { email } });
          mail(
            "Updated Your Password",
            `Your Password Has been Updated.`,
            `Hello,${recruiter1.first_name} ${recruiter1.last_name} Thanks for choosing MyJobs,Your Password Has been Updated.`,
            email
          );
          res.json({
            msg: "Sucessfully Updated the Password",
          });
        }
      });
    } catch (error) {
      res.send(error);
    }
  },
  recruiterViewJobs: async (req, res) => {
    try {
        let pageNumber=Number.parseInt(req.query.page)
        let sizeNumber=Number.parseInt(req.query.size)

      let {page,size}=pagination(pageNumber,sizeNumber)

      let result = await appliedJobs.findAndCountAll({
        where: { recruiterId: req.user.dataValues.id },
        order: [["createdAt", "DESC"]],
        limit:size, offset:page*size
        
      });
      
      if (!result) {
        res.json({
          msg: `${req.user.dataValues.firstName} ${req.user.dataValues.firstName} you don't have any jobs posted.`,
        });
      } else {
        res.json({
          msg: result,
          totalPages:result.count/size
        });
      }
    } catch (error) {
      res.send(error);
    }
  },
};
