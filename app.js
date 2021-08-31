const express = require('express');
const axios = require('axios');
const cookieParser = require('cookie-parser');

const app = express();

const api = axios.create({
    baseURL: "http://localhost:3333",
});

var auth;

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

require('./controllers/homeController')(app);
require('./controllers/userController')(app);
require('./controllers/storeController')(app);

app.listen(3000, () => console.info(`App listening on port: 3000`));