const express = require('express');
const api = require('axios').create({ baseURL: "http://localhost:3333" });

const router = express.Router();

router.get('', async (req, res) => {
    const res_products = await api.get('listproducts');
    const products = res_products.data;

    const res_stores = await api.get('store');
    const stores = res_stores.data;

    res.render('home', { 'products': products, 'stores': stores });
});

router.get('/product/:id', async (req, res) => {
    const res_product = await api.get('listproducts/' + req.params.id);
    res.render('product', { 'product': res_product.data });
});

router.get('/cart', (req, res) => {
    res.render('cart');
});

router.get('/store/:store', async (req, res) => {
    try {
        const res_store = await api.get('store/' + req.params.store);
        const res_products = await api.get('listproducts/store/' + req.params.store);
        res.render('store', { 'store': res_store.data, 'products': res_products.data });
    } catch (error) {

    }
});

module.exports = app => app.use('', router);