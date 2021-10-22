const winston = require('winston');

// Error handler middleware
module.exports = function(err, req, res, next){
    winston.error(err.message, err);
    res.status(500).send(err.message);
}