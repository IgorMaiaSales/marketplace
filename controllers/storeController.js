const express = require('express');
const api = require('axios').create({ baseURL: "http://localhost:3333" });

const router = express.Router();

router.get('', async (req, res) => {
    const storeLog = req.cookies.storeLog

    if (storeLog) {
        const store_info = req.cookies.store;
        const res_products = await api.get('listproducts/store/' + store_info.name);
        const products = res_products.data;

        res.render('storepanel', { 'store': store_info, 'products': products });
    } else {
        res.redirect('/storepanel/login');
    }
});

router.get('/login', (req, res) => {
    res.render('storelogin', { 'error': undefined });
});

router.post('/login', async (req, res) => {
    try {
        const store = {
            email: req.body.email,
            password: req.body.password
        };

        const res_store = await api.post('store/authenticate', store);

        const token = res_store.data.token;
        const store_info = res_store.data.store;

        res.cookie('store', store_info);
        res.cookie('storeToken', token);
        res.cookie('storeLog', true);

        res.redirect('/storepanel')
    } catch (error) {
        res.render('storelogin', { 'error': error })
    }
});

router.get('/signin', (req, res) => {
    res.render('storesignin', { 'error': undefined });
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

router.get('/logout', async (req, res) => {
    res.clearCookie('store');
    res.clearCookie('storeToken');
    res.clearCookie('storeLog');

    res.redirect('login')
})

router.get('/newproduct', (req, res) => {
    res.render('newproduct', { 'error': undefined });
});

router.post('/newproduct', async (req, res) => {
    try {
        const product = {
            store: req.cookies.store.name,
            name: req.body.name,
            description: req.body.description,
            photo_main: req.body.image1,
            photo_1: req.body.image2,
            photo_2: req.body.image3,
            category: req.body.category,
            price: req.body.price
        }

        const { data } = await api.post('listproducts/register/product', product);

        res.redirect('/storepanel');
    } catch (error) {
        res.render('newproduct', { 'error': error });
    }
});

router.get('/del/:id', async (req, res) => {
    try {
        const store_remove = await api.delete('listproducts/del/' + req.params.id);

        res.redirect('/storepanel');
    } catch (error) {
    }
})

module.exports = app => app.use('/storepanel', router);