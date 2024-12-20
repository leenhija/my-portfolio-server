// import express from 'express'
const express=require('express')
const router = express.Router();
// import cors from 'cors'
const cors=require('cors')
// import nodemailer from 'nodemailer'
const nodemailer=require('nodemailer')
// import path from 'path'
const dotenv=require('dotenv')
dotenv.config()
const app = express();
app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to my server!',
      instructions: 'Use POST /contact to send emails.',
      status: 'Server is running',
    });
  });
const PORT=process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use("/", router);
app.listen(PORT, () => console.log("Server Running"));

const contactEmail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
});

contactEmail.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready to Send");
  }
});

router.post("/contact", (req, res) => {
  const name = req.body.fullName ;
  const email = req.body.email;
  const message = req.body.message;
  const mail = {
    from: name,
    to: process.env.EMAIL_USER,
    subject: "Contact Form Submission - Portfolio",
    html: `<p>Name: ${name}</p>
           <p>Email: ${email}</p>
           <p>Message: ${message}</p>`,
  };
  contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json(error);
    } else {
      res.json({ code: 200, status: "Message Sent" });
    }
  });
});