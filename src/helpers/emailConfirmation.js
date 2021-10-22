const crypto = require('crypto-js');
const nodemailer = require('nodemailer');
const { EmailToken } = require('../models/emailToken');

// Send email function (Used Gmail Smtp)
module.exports = async function (user, subject, emailBody){

        const token = crypto.lib.WordArray.random(128 / 8);

        // Send a confirmation mail!!!
        const smtpTransport = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const  mailOptions = { 
            from: 'no-reply@colmplaints.com', 
            to: user.email, 
            subject: subject, 
            text: emailBody
        };
        
        const sendMail = await smtpTransport.sendMail(mailOptions);
        if(!sendMail) res.status(500).send('Technical Issue!, Please click on resend for verify your Email.');

}