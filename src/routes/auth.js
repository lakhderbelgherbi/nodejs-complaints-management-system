const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../models/user');
const { userLogin } = require('../validations/userValidation');

const router = express.Router();


// Authentication router
router.post('/', async (req, res) => {
    const { error } = userLogin(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(404).send('User not found');

    const passwordHash = await bcrypt.compare(req.body.password, user.password);
    if(!passwordHash) return res.status(400).send('Email or password incorrect');

    if(!user.isVerified) return res.status(401).send('Your email has not been verified!');

    const token = jwt.sign({_id: user._id, role: user.role}, process.env.JWT_SECRET_KEY);
    res.header('x-auth-token', token).header('access-control-expose-headers', 'x-auth-token').send(user);

});



module.exports = router;
