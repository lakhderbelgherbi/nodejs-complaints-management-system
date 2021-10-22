const winston = require('winston'); 
const mongoose = require('mongoose');
const uri = process.env.DB_CONNECT;

module.exports = function(){
    mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true     
    })
            .then(() => winston.info('Successfuly connected to mongoDB ....'));
}