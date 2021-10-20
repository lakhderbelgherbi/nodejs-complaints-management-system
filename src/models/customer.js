const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    last_name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true 
    },
    phone: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true,
    }
});



const Customer = new mongoose.model('Customer', customerSchema);


module.exports.customerSchema = customerSchema;
module.exports.Customer       = Customer