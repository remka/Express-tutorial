// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
var passport = require('passport');
var validator = require('express-validator');
var expressLayouts = require('express-ejs-layouts');

// Routes
var routesApi = require('./routes/api');
var routesAuth = require('./routes/auth');
var routesAdmin = require('./routes/admin');
// Config
var config = require('./config/secret');

// Use environment defined port or 3000
var port = process.env.PORT || 3000;

// Connect to the beerlocker MongoDB
mongoose.connect(config.mongoUrl, { useNewUrlParser: true });

// Create our Express application
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// public folder for CSS, etc.
app.use(express.static(__dirname + '/public'));

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
