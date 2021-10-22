const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto-js');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const { User } = require('../models/user');
const { EmailToken } = require('../models/emailToken');
const { userRegistraion, userUpdateRegistraion, passwordReset, passwordResetFormValidation, changePasswordValidation, userSetRoleValidation, userSetTeamValidation } = require('../validations/userValidation');

const emailConfirmation = require('../helpers/emailConfirmation');
const uploadFileMiddleware = require('../middlewares/fileUpload');
const auth = require('../middlewares/auth');
const resizeImage = require('../helpers/resizeImage');
const admin = require('../middlewares/admin');
const { Team } = require('../models/team');


const router = express.Router();


// Users list
router.get('/', auth, async (req, res) => {
    const users = await User.find();
    res.send(users);
});

// Create new user
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

        const token = crypto.lib.WordArray.random(128 / 8);
        const emailToken = new EmailToken({_userId: user._id, token: token});
        await emailToken.save(); 
    
        const username = user.first_name+' '+user.last_name;
        const subject = 'Account Verification Link';
        const emailBody = 'Hello '+ username +',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/api\/users\/confirmation\/' + user.email + '\/' + emailToken.token + '\n\nThank You!\n'
        emailConfirmation(user, subject, emailBody);

         res.status(200).send('Please check your email, We hope that you confirm your subscription');
});


// Update an existing user
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

// Consume token sent to email for user sign up confirmation
router.get('/confirmation/:email/:token', async (req, res) => {
    const token = await EmailToken.findOne({token: req.params.token});
    if(!token) return res.status(404).send('Your verification link may have expired. Please click on resend for verify your Email.')

    
    const user = await User.findOne({_id: token._userId, email: req.params.email});
    if(!user) return res.status(401).send('We were unable to find a user for this verification. Please SignUp!');


    if(user.isVerified) res.status(200).send('User has been already verified. Please Login');

    user.isVerified = true;
    await user.save()
    await token.delete();


    res.status(200).send('Your account has been successfully verified');

});



// Resend link to user's email for confirmation
router.get('/resendlink/:email', async (req, res) => {
    const user = await User.findOne({email: req.params.email});
    if(!user) return res.status(401).send('We were unable to find a user for this email. Please SignUp!');

    if (user.isVerified) return res.status(200).send('This account has been already verified. Please log in.');

    const username = user.first_name+' '+user.last_name;
    emailConfirmation(user, username, req.headers.host);
         
    res.status(200).send('A verification email has been sent to ' + user.email + '. It will be expire after one day. If you not get verification Email click on resend token.');

});


// Reset user password
router.post('/resetPassword', async (req, res) => {
    const { error } = passwordReset(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(404).send('user with given email doesn\'t exist');

    if(!user.isVerified) return res.status(401).send('Your email has not been verified!. Please activate your account');

    const token=crypto.lib.WordArray.random(128 / 8);

    let emailToken = await EmailToken.findOne({ email: user._id.toString() });
    if (!emailToken) {
        emailToken = await new EmailToken({
            _userId: user._id.toString(),
            token: token,
        }).save();
    }

    const subject = 'Reset Password';
    const emailBody = 'Hello '+ user.email +',\n\n' + 'Please click on the link below to reset your password: \nhttp:\/\/' + req.headers.host + '\/api\/users\/passwordresetform\/' + user.email + '\/' + emailToken.token + '\n\nThank You!\n'
    emailConfirmation(user, subject, emailBody);

    res.send("password reset link sent to your email account");

});


// Consume token for reset password
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


// Uplaod user profile image
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


// Change User password
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

// Get current user
router.get('/me', auth, async(req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});


// Delete existing user
router.delete('/:id', [auth, admin], async (req, res) => {
    const user = await User.findById(req.params.id);
    if(!user) return res.status(404).send('The user with the given ID was not fount!');

    await user.delete();


    res.send(user);

});

// Set a role to user(default user -> agent)
router.put('/:id/setrole', [auth, admin], async(req, res) => {
    const { error } = userSetRoleValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
    if(!isValidId) return res.status(400).send('Please check ID');

    let user = await User.findByIdAndUpdate({_id: req.params.id}, {
        $set: {
            role: req.body.role
        }
    });

    if(!user) return res.status(404).send('The user with the given ID was not found');

    return res.send(user);
});

// Set a team to user
router.put('/:id/setteam', [auth, admin], async(req, res) => {
    const { error } = userSetTeamValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
    if(!isValidId) return res.status(400).send('Please check user ID');

    let user = await User.findById(req.params.id);
    if(!user) return res.status(400).send('The user with the given ID was not found')

    const team = await Team.findById(req.body.team)
    if(!team) return res.status(404).send('The team with the given ID was not found');

    user.team = {
        _id: team._id,
        team_name: team.team_name
    }
    
    await user.save();
    
    return res.send(user);
});







module.exports = router;