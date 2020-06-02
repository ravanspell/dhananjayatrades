const router = require('express').Router();
const jwt = require('jsonwebtoken');
let mysqldb = require('../mysqldb');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');

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
        const { nic, username, password } = req.body;
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt);
        const query = `INSERT INTO user (id,name,password)
                       VALUES(${nic},'${username}','${hashedPassword}')`;
        await mysqldb.query(query);
        res.json({ status: false, message: "User has been saved" });
    } catch (error) {
        res.status(400).json({ status: false, error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const [user] = await mysqldb.query(`SELECT Name,Password FROM user WHERE Name ='${username}'`);
    if (!user) {
        return res.status(400).json({ status: false, message: 'Sorry you do not have an account' });
    }
    const is_authnticted = await bcrypt.compare(password, user.Password);
    if (!is_authnticted) {
        return res.status(400).json({ status: false, message: 'Your user name or password incorrect' });
    }
    const accessToken = jwt.sign({ user: user.Name }, process.env.SECRET_KEY);
    //return res.header('auth-token', accessToken).send(accessToken);
    return res.status(200).json({ status: true, username: user.Name, token: accessToken });
});

router.route('/currant').get(auth, async (req, res) => {
    return res.status(200).json({ status: true, user: req.user.user });
});
module.exports = router;