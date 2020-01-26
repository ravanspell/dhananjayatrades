const Express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const port = process.env.PORT;
const dburl = process.env.DB_URL;

const app = Express();
//Middlewares
app.use(cors());
app.use(Express.json());
//mongodb connect
mongoose.connect(dburl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
const dbConnection = mongoose.connection;
dbConnection.on('error', console.error.bind(console, 'connection error:'));
dbConnection.once('open', function () {
    console.log("mongo db connected!");
});

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