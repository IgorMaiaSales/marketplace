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
    //receber os produtos do banco de dados
    const res_products = await api.get('listproducts');
    const products = res_products.data;

    //receber as lojas do banco de dados
    const res_stores = await api.get('store');
    const stores = res_stores.data;

    //renderizar os produtos e lojas no home.ejs
    res.render('home', { 'products': products, 'stores': stores });
});

app.get('/product/:id', async (req, res) => {
    const res_product = await api.get('listproducts/' + req.params.id);
    res.render('product', { 'product': res_product.data });
});

app.get('/cart', (req, res) => {
    res.render('cart');
});

app.get('/store/:store', async (req, res) => {
    try {
        const res_store = await api.get('store/' + req.params.store);
        const res_products = await api.get('listproducts/store/' + req.params.store);
        res.render('store', { 'store': res_store.data, 'products': res_products.data });
    } catch (error) {

    }
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
        console.log(data);

        auth = 'Bearer ' + data.token

        res.redirect('/user');
    } catch (error) {
        res.render('login', { 'error': error });
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
    } catch (error) {
        res.render('/signin', { 'error': error });
    }
});

app.get('/user', async (req, res) => {

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

app.listen(3000, () => console.info(`App listening on port: 3000`));