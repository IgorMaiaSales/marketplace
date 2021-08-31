const express = require('express');
const api = require('axios').create({ baseURL: "http://localhost:3333" });

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('storelogin', { 'error': undefined });
});

router.post('/login', async (req, res) => {
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

        res.render('storepanel', { 'store': store_info, 'token': token, 'products': res_products.data });
    } catch (error) {
        res.render('storelogin', { 'error': error })
    }
});

router.get('', async (req, res) => {
    try {

    } catch (error) {

    }
});

router.get('/signin', (req, res) => {
    res.render('storesignin');
});

router.post('/signin', async (req, res) => {
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

router.get('/newproduct', (req, res) => {
    res.render('newproduct');
});

router.post('/newproduct', async (req, res) => {
    try {

    } catch (error) {

    }
});

module.exports = app => app.use('/storepanel', router);