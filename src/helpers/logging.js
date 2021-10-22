const winston = require('winston');
require('express-async-errors');
require('winston-mongodb');

// Errors logger 

const uri = process.env.DB_CONNECT;

module.exports = function(){
    // Logger funcctions
    winston.add(
        new winston.transports.File({filename: 'logs/logfile.log'}),
    );
    winston.add(
        new winston.transports.Console(),
    );

    winston.add(
        new winston.transports.MongoDB(
            {
                db: uri,
                level: 'info'
            }
        )
    );
           
    process.on('unhandledRejection', err => {
        winston.error(err.message, err);
    });

    winston.exceptions.handle(
        new winston.transports.File({ filename: 'logs/logfile.log' }),
        new winston.transports.Console()
    );

}