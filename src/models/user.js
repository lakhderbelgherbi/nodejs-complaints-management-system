const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    last_name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true 
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    phone: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true,
    },
    role: {
        type: Array,
        default: [],
    },
    team:{
        type: String,
    },
    photo: {
        type:String,
    },
    isVerified: {
        type: Boolean,
        default: false    
    }
});

const User = new mongoose.model('User', userSchema);

module.exports.userSchema = userSchema;
module.exports.User = User;
