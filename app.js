if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

const app = express();

const users = [];

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

app.get('', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/signin', (req, res) => {
    res.render('signin');
});

app.get('/user', (req, res) => {
    res.render('user');
});

app.get('/store/login', (req, res) => {
    res.render('storelogin');
});

app.post('/signin', async (req, res) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 10);
        users.push({
            id: Date.now().toString(),
            username: req.body.username,
            email: req.body.email,
            password: hash,
            address: req.body.address
        });
        // enviar para o banco de dados
        console.log(users);
        res.redirect('/login');
    } catch {
        res.redirect('/signin');
    }
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/user',
    failureRedirect: '/login',
    failureFlash: true
}));
// login + banco de dados

app.get('/produtos', (req, res) => {
    // recebe produtos do banco de dados
});

app.listen(3000, () => console.info(`App listening on port: 3000`));