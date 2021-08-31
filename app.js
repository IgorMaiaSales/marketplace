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

// E-commerce

app.get('', async (req, res) => {
    //receber os produtos do banco de dados
    const res_products = await api.get('listproducts');
    const products = res_products.data;

    //receber as lojas do banco de dados
    const res_stores = await api.get('store');
    const stores = res_stores.data;
    console.log(req.cookies);

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
    res.render('login', { 'error': undefined });
});

app.post('/login', async (req, res) => {
    try {
        const user = {
            email: req.body.email,
            password: req.body.password
        };

        const { data } = await api.post('auth/authenticate', user);

        res.cookie('user', data.user);
        res.cookie('token', data.token);
        res.cookie('logged', true);

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

    const { data } = await api.get('user', { 'headers': { 'Authorization': req.cookies.token } });
    console.log(data);

    const user = req.cookies.user

    res.render('user', { 'user': user });
});

// Ambiente do Lojista

app.get('/storepanel/login', (req, res) => {
    res.render('storelogin', { 'error': undefined });
});

app.post('/storepanel/login', async (req, res) => {
    try {
        const store = {
            email: req.body.email,
            password: req.body.password
        };

        const { data } = await api.post('store/authenticate', store);
        console.log(data);

        const token = 'Bearer ' + data.token;
        const store_info = data.store;

        const res_products = await api.get('listproducts/store/' + store_info.name);

        res.cookie('store', store_info);
        console.log()

        res.render('storepanel', { 'store': store_info, 'token': token, 'products': res_products.data });
    } catch (error) {
        res.render('storelogin', { 'error': error })
    }
});

app.get('/storepanel', async (req, res) => {
    try {

    } catch (error) {

    }
});

app.get('/storepanel/signin', (req, res) => {
    res.render('storesignin');
});

app.post('/storepanel/signin', async (req, res) => {
    try {
        const store = {
            name: req.body.store_name,
            email: req.body.email,
            password: req.body.password,
            description: req.body.description,
            logo: req.body.store_logo
        };
        console.log(store);

        const { data } = await api.post('store/register', store);
        console.log(data);

        res.redirect('/storepanel/login');
    } catch (error) {
        res.render('storesignin', { 'error': error });
    }
});

app.get('/newproduct', (req, res) => {
    res.render('newproduct');
});

app.post('/newproduct', async (req, res) => {
    try {

    } catch (error) {

    }
});

app.listen(3000, () => console.info(`App listening on port: 3000`));