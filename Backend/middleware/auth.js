const jwt = require('jsonwebtoken');

const Auth = (req, res, next) => {
    const authHeader = req.headers['authorization']
    if (!authHeader)
        return res.status(401).send('Access Denied');
    const token = authHeader.split(' ')[1];
    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY)
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send("Invalid Token");
    }
}

module.exports = Auth;