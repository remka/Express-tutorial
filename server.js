// Get the packages we need
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('express-flash');
var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
var passport = require('passport');
var validator = require('express-validator');
var expressLayouts = require('express-ejs-layouts');

require('dotenv').config();

// Routes
var routesApi = require('./routes/api');
var routesAuth = require('./routes/auth');
var routesAdmin = require('./routes/admin');

// Use environment defined port or 3000
var port = process.env.PORT || 3000;

// Connect to the beerlocker MongoDB
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

// Create our Express application
var app = express();
var sessionStore = new session.MemoryStore;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// public folder for CSS, etc.
app.use(express.static(__dirname + '/public'));

app.use(cookieParser('MVrU0Amy41IlWR0knL6uQtVAopiKqUiAhxcSBR6t'));
app.use(session({
    cookie: { maxAge: 60000 },
    store: sessionStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'qonhay83Z3yOl3XRwwzhLxYrnY6J2d46sP0DIvsg'
}));
app.use(flash());

app.use(expressLayouts);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(validator());

// Register all our routes with /api
app.use('/api', routesApi);
app.use('/auth', routesAuth);
app.use('/admin', routesAdmin);


// Start the server
app.listen(port);
console.log('Server is running on http://localhost:' + port);
