const mongoose = require('mongoose');

const emailTokenSchema = mongoose.Schema({
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    expireAt:{
        type: Date, 
        default: Date.now, 
        index: { expires: 86400000 }
    }
});

const EmailToken = new mongoose.model('EmailToken', emailTokenSchema);


module.exports.EmailToken = EmailToken;
module.exports.emailTokenSchema = emailTokenSchema;