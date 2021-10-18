const jwt = require('jsonwebtoken');

module.exports = function(req, res, next){
    const token = req.header('x-auth-token');
    console.log(token);
    if(!token) return res.status(401).send('Acces Denied!');

    try {
        const decodedPayload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decodedPayload;

        next();
    } catch (ex) {
        return res.status(400).send('Invali Token!');        
    }
}