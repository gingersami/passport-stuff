// Get dependencies
import * as express from 'express'
import * as mysql from 'mysql'
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();
const LocalStrategy = require('passport-local').Strategy;
const expressSession = require('express-session');
app.use(expressSession({secret: 'thisIsASecret', resave: false, saveUninitialized: false}));


passport.use(new LocalStrategy(function (username, password, done) {
  if ((username === 'test') && (password === 'test2')) {
    return done(null, {username: username, id: 1});
  } else {
    return done(null, false);
  }
}));

const connection = mysql.createPool({
  host:'localhost',
  user:'root',
  password:'123456',
  database:
})

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
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
  } else {
    res.redirect('/login');
  }
}


// Point static path to dist
app.get('/login', (req, res) => {
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
  res.send('Logged out!') ;
});

app.post('/register', (req,res)=>{

})

// Catch all other routes and return the index file
app.get('*', authOnly, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => console.log(`API running on localhost:${port}`));
