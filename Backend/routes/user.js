const router = require('express').Router();
const jwt = require('jsonwebtoken');
let User = require('../models/user.model');
let mysqldb = require('../mysqldb');

router.get('/t', async (req, res) => {
    let query = "SELECT * FROM `user` ORDER BY id ASC";
    try {
        const users = await mysqldb.query(query);
        res.json(users)
    } catch (error) {
        res.status(400).json({ status: false, error: error.message })
    }
});

router.route('/add').post((req, res) => {
    const userData = req.body;
    const newUser = new User(userData);
    newUser.save()
        .then(() => res.json({ status: false, message: 'User Added' }))
        .catch(error => res.status(400).json({ status: false, error: error }));
});

router.route('/login').post((req, res) => {
    const userName = req.body.username;
    const password = req.body.password;
    const user = { name: userName }
    const accessToken = jwt.sign(user, process.env.SECRET_KEY);
    res.status(200).json({ status: true, token: accessToken });
});
module.exports = router;