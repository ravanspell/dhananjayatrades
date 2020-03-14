const Express = require('express');
const mysql = require('mysql');
const cors = require('cors');

require('dotenv').config();

const port = process.env.PORT;

const app = Express();
//Middlewares
app.use(cors());
app.use(Express.json());
//mysql connect
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
// connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;

const user = require('./routes/user');
const items = require('./routes/items');
const orders = require('./routes/orders');
app.use('/api/user', user);
app.use('/api/items', items);
app.use('/api/orders', orders);

//start node js server
app.listen(port, () => {
    console.log("server started");
});