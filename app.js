if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const axios = require('axios');

const app = express();

const api = axios.create({
    baseURL: "http://localhost:3333",
});

var auth;

const initializePassport = require('./config/passport-config.js')
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/'));
app.use(express.urlencoded({ extended: false }));

app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// E-commerce

app.get('', async (req, res) => {
    //receber 10 produtos do banco de dados
    const res_products = await api.get('listproducts');
    const products = res_products.data;
    //receber 5 lojas do banco de dados
    const res_stores = await api.get('store');
    const stores = res_stores.data;
    //renderizar os produtos e lojas no home.ejs

    res.render('home', { 'products': products, 'stores': stores });
});

app.get('/product', (req, res) => {

    res.render('product');
});

app.get('/search', (req, res) => {
    res.render('search');
});

app.get('/cart', (req, res) => {
    res.render('cart');
});

// Ambiente do Usuário

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    try {
        const user = {
            email: req.body.email,
            password: req.body.password
        };

        const { data } = await api.post('auth/authenticate', user);

        auth = 'Bearer ' + data.token

        console.log(data);

        res.redirect('/user');
    } catch (error) {

    }
});

app.get('/signin', (req, res) => {
    res.render('signin');
});

app.post('/signin', async (req, res) => {
    try {
        const user = {
            name: req.body.username,
            email: req.body.email,
            password: req.body.password,
            address: req.body.address
        };

        const { data } = await api.post('auth/register', user);

        res.redirect('/login');
    } catch {
        res.redirect('/signin');
    }
});

app.get('/user', async (req, res) => {

    console.log('Tô aqui')

    console.log(auth);

    const { data } = await api.get('user', { 'headers': { 'Authorization': auth } });

    res.render('user');
});

// Ambiente do Lojista

app.get('/store/login', (req, res) => {
    res.render('storelogin');
});

app.post('/store/login', async (req, res) => {
    try {
        const store = {
            email: req.body.email,
            password: req.body.password
        };

        const { data } = await api.post('store/authenticate', store);

        auth = 'Bearer ' + data.token

        console.log(data);

        res.redirect('/user');
    } catch (error) {

    }
});

app.get('/store/signin', (req, res) => {
    res.render('storesignin');
});

app.get('/store/newproduct', (req, res) => {
    res.render('newproduct');
});

// Ambiente do Administrador

app.get('/adm/login', (req, res) => {
    res.render('admlogin');
});

app.get('/produtos', (req, res) => {
    // recebe produtos do banco de dados
});

app.listen(3000, () => console.info(`App listening on port: 3000`));