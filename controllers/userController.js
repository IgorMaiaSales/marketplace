const express = require('express');
const api = require('axios').create({ baseURL: "http://localhost:3333" });

const router = express.Router();

router.get('/signin', (req, res) => {
    res.render('signin');
});

router.post('/signin', async (req, res) => {
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

router.get('/login', (req, res) => {
    res.render('login', { 'error': undefined });
});

router.post('/login', async (req, res) => {
    try {
        const user = {
            email: req.body.email,
            password: req.body.password
        };

        const { data } = await api.post('auth/authenticate', user);

        res.cookie('user', data.user);
        res.cookie('userToken', data.token);
        res.cookie('userLog', true);

        res.redirect('/user');
    } catch (error) {
        res.render('login', { 'error': error });
    }
});

router.get('/logout', async (req, res) => {
    res.clearCookie('user');
    res.clearCookie('userToken');
    res.clearCookie('userLog');

    res.redirect('login')
})

router.get('', async (req, res) => {
    const userLog = req.cookies.userLog;

    if (userLog) {
        const { data } = await api.get('user', { 'headers': { 'Authorization': 'Bearer ' + req.cookies.userToken } });

        const user = req.cookies.user;

        const res_requests = await api.get('user_requests/user/' + req.cookies.user.name);
        const requests = res_requests.data;

        res.render('user', { 'user': user, 'requests': requests });
    } else {
        res.redirect('/user/login');
    }
});

module.exports = app => app.use('/user', router);