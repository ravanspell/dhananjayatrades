const jwt = require('jsonwebtoken');
const mysqldb = require('../mysqldb');

const Role = (role =[]) => {
    return async (req, res, next) => {
        const authHeader = req.headers['authorization']
        if (!authHeader)
            return res.status(401).send('Access Denied');
        const token = authHeader.split(' ')[1];
        try {
            const user = jwt.decode(token, process.env.SECRET_KEY)
            const userId = user?.id
            const userRole = user?.role;
           
            if (userId && userRole) {
                if(role.includes(userRole)){
                    const [savedUser] = await mysqldb.query(`SELECT id,role FROM user WHERE id ='${userId}'`);
                    if (savedUser?.role === userRole) {
                        next();
                    } else {
                        res.status(400).send("No permissions");
                    }
                }else{
                    res.status(400).send("No permissions");
                }
            } else {
                res.status(400).send("invalid jwt or user not exist");
            }

        } catch (error) {
            res.status(400).send("Invalid Token");
        }
    }
}

module.exports = Role;