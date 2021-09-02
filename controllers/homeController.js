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
    if (req.cookies.cart) {
        const products = req.cookies.cart;
        var subtotal = 0;

        products.forEach(product => {
            subtotal += product.price;
        });

        const total = subtotal + 40;

        res.render('cart', { 'products': products, 'subtotal': subtotal, 'total': total });
    } else {
        res.render('cart', { 'products': undefined, 'subtotal': 0, 'total': 40 })
    }

});

router.get('/cart/add/:id', async (req, res) => {
    try {
        const res_product = await api.get('listproducts/' + req.params.id);
        const product = res_product.data;
        var cart = [];

        if (req.cookies.cart) {
            cart = req.cookies.cart;
            cart.push(product);
            res.cookie('cart', cart);
        } else {
            cart = [product];
            res.cookie('cart', cart);
        }

        res.redirect('/cart');
    } catch (error) {
        res.render('login', { 'error': error });
    }
});

router.get('/cart/del/:id', async (req, res) => {
    try {
        var products = req.cookies.cart;

        for (i = 0; i < products.length; i++) {
            if (products[i]._id == req.params.id) {
                products.splice(i, 1);
                console.log('here to')
            }
            console.log('here')
        }

        res.cookie('cart', products);

        res.redirect('/cart');
    } catch (error) {
        res.render('login', { 'error': error });
    }
});

router.get('/store/:store', async (req, res) => {
    try {
        const res_store = await api.get('store/' + req.params.store);
        const res_products = await api.get('listproducts/store/' + req.params.store);
        res.render('store', { 'store': res_store.data, 'products': res_products.data });
    } catch (error) {

    }
});

router.get('/buy', async (req, res) => {
    try {
        if (req.cookies.userLog) {
            const request = {
                user: req.cookies.user.name,
                products: req.cookies.cart
            }

            const res_add = await api.post('user_requests/register', request);

            res.clearCookie('cart');

            res.redirect('/user')
        } else {
            res.redirect('/user/login')
        }
    } catch (error) {
        res.render('/user/login', { 'error': error });
    }
})

module.exports = app => app.use('', router);