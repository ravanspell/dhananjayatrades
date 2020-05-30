const jwt = require('jsonwebtoken');

const Auth = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token)
        return res.status(401).send('Access Denied');
    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY)
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send("Invalid Token");
    }
}

module.exports = Auth;