const router = require('express').Router();
const jwt = require('jsonwebtoken');
let mysqldb = require('../mysqldb');
const bcrypt = require('bcrypt');

router.get('/t', async (req, res) => {
    let query = "SELECT * FROM User ORDER BY id ASC";
    try {
        const users = await mysqldb.query(query);
        res.json(users)
    } catch (error) {
        res.status(400).json({ status: false, error: error.message })
    }
});

router.post('/add', async (req, res) => {
    try {
        const { user_name, password } = req.body;
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt);
        // const query = `INSER INTO users 
        //                COLUNS() 
        //                VALUES('${user_name}','${hashedPassword}')`;
        // await mysqldb.query(query);
        res.json({ status: false, message: hashedPassword });
    } catch (error) {
        res.status(400).json({ status: false, error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { user_name, password } = req.body;
    const [user] = await mysqldb.query(`SELECT Name,Password FROM user WHERE Name ='${user_name}'`);
    if (!user) {
        return res.status(400).json({ status: false, message: 'Sorry you do not have an account' });
    }
    const is_authnticted = await bcrypt.compare(password, user.Password);
    console.log(is_authnticted);
    if (!is_authnticted) {
        return res.status(400).json({ status: false, message: 'Your user name or password incorrect' });
    }
    const accessToken = jwt.sign({ user: user.Name }, process.env.SECRET_KEY);
    //return res.header('auth-token', accessToken).send(accessToken);
    return res.status(200).json({ status: false, token: accessToken });
});
module.exports = router;