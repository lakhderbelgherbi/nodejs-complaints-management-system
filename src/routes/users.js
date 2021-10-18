const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto-js');
const nodemailer = require('nodemailer');
// const multer =require('multer');


const { User } = require('../models/user');
const { EmailToken } = require('../models/emailToken');
const { userRegistraion, userUpdateRegistraion, passwordReset, passwordResetFormValidation, changePasswordValidation } = require('../validations/userValidation');

const emailConfirmation = require('../utils/emailConfirmation');
const uploadFileMiddleware = require('../middlewares/fileUpload');
const auth = require('../middlewares/auth');
const resizeImage = require('../utils/resizeImage');


const router = express.Router();



router.get('/', auth, async (req, res) => {
    const users = await User.find();
    res.send(users);
});


router.post('/', async (req, res) => {
    const { error } = userRegistraion(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send('User Already exists!!!');

        
        user = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
            role: req.body.role,
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();
    
        const username = user.first_name+' '+user.last_name;
        emailConfirmation(user, username, req.headers.host);



        res.status(200).send(user);
});


router.put('/', auth, async (req, res) => {
    const { error } = userUpdateRegistraion(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await User.findByIdAndUpdate({_id: req.user._id},
        {
            $set: {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                phone: req.body.phone
            }
        }  
    ).select('-password');
    res.send(user);
});


router.get('/confirmation/:email/:token', async (req, res) => {
    const token = await EmailToken.findOne({token: req.params.token})
    if(!token) return res.status(404).send('Your verification link may have expired. Please click on resend for verify your Email.')

    
    const user = await User.findOne({_id: token._userId, email: req.params.email});
    if(!user) return res.status(401).send('We were unable to find a user for this verification. Please SignUp!');


    if(user.isVerified) res.status(200).send('User has been already verified. Please Login');

    user.isVerified = true;
    await user.save()
    await token.delete();


    res.status(200).send('Your account has been successfully verified');

});




router.get('/resendlink/:email', async (req, res) => {
    const user = await User.findOne({email: req.params.email});
    if(!user) return res.status(401).send('We were unable to find a user for this email. Please SignUp!');

    if (user.isVerified) return res.status(200).send('This account has been already verified. Please log in.');

    const username = user.first_name+' '+user.last_name;
    emailConfirmation(user, username, req.headers.host);
         
    res.status(200).send('A verification email has been sent to ' + user.email + '. It will be expire after one day. If you not get verification Email click on resend token.');

});



router.post('/resetPassword', async (req, res) => {
    const { error } = passwordReset(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(404).send('user with given email doesn\'t exist');

    if(!user.isVerified) return res.status(401).send('Your email has not been verified!. Please activate your account');

    
    let emailToken = await EmailToken.findOne({ email: user._id.toString() });
    if (!emailToken) {
        emailToken = await new EmailToken({
            _userId: user._id.toString(),
            token: crypto.lib.WordArray.random(128 / 8),
        }).save();
    }


    // //   Send a confirmation mail!!!
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
        subject: 'Reset Password', 
        text: 'Hello '+ user.email +',\n\n' + 'Please click on the link below to reset your password: \nhttp:\/\/' + req.headers.host + '\/api\/users\/passwordresetform\/' + user.email + '\/' + emailToken.token + '\n\nThank You!\n' };
    
    const sendMail = await smtpTransport.sendMail(mailOptions);
    if(!sendMail) res.status(500).send('Technical Issue!, Please click on resend for verify your Email.');

    res.send("password reset link sent to your email account");

});



router.post('/passwordresetform/:email/:token', async (req, res) => {
    const { error } = passwordResetFormValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(400).send("invalid link or expired");


    const emailToken = await EmailToken.findOne({
        _userId: user._id,
        token: req.params.token,
    });
    if (!emailToken) return res.status(400).send("Invalid link or expired");


    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    await user.save();
    await emailToken.delete();

    res.send("password reset sucessfully.");
})



router.post('/uploadFile', auth, uploadFileMiddleware, async (req, res) => {
    const file = req.file;
    if(!file) return res.status(404).send('Please upload a file.')

    const user = await User.findOne({_id: req.user._id});

    // This function resize images
    //resizeImage(file);
    
    user.photo = file.path;
    await user.save();

    return res.send(user);
});




router.put('/changepassword', auth, async (req, res) => {
    const { error } = changePasswordValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);


    const user = await User.findOne({ _id: req._id });
    if (!user) return res.status(400).send("User not found!!");


    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    await user.save();
    res.send(user);
});


router.get('/me', auth, async(req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    console.log(user);
    res.send(user);
});







module.exports = router;