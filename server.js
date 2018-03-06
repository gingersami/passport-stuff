"use strict";
exports.__esModule = true;
// Get dependencies
var express = require("express");
var mysql = require("mysql");
var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');
var passport = require('passport');
var app = express();
var LocalStrategy = require('passport-local').Strategy;
var expressSession = require('express-session');
app.use(expressSession({ secret: 'thisIsASecret', resave: false, saveUninitialized: false }));
passport.use(new LocalStrategy(function (username, password, done) {
    if ((username === 'test') && (password === 'test2')) {
        return done(null, { username: username, id: 1 });
    }
    else {
        return done(null, false);
    }
}));
var connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 
});
// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Authentication middleware
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});
function authOnly(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        res.redirect('/login');
    }
}
// Point static path to dist
app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname, 'src/login.html'));
});
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login?err'
}));
app.use(authOnly, express.static(path.join(__dirname, 'dist')));
app.get('/userDetails', authOnly, function (req, res) {
    res.send(req.user);
});
app.get('/logout', function (req, res) {
    req.logout();
    res.send('Logged out!');
});
app.post('/register', function (req, res) {
});
// Catch all other routes and return the index file
app.get('*', authOnly, function (req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});
var port = process.env.PORT || '3000';
app.set('port', port);
var server = http.createServer(app);
server.listen(port, function () { return console.log("API running on localhost:" + port); });
