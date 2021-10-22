

// TeamLeader middleware
module.exports = function(req, res, next){
    if(req.user.role !== 'teamLeader') return res.status(403).send('Acces denied!');

    next();
}