var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('../models/user');
var faker = require('faker');
var Token = require('../models/token');
var crypto = require('crypto');
var nodemailer = require('nodemailer');

// dashboard
exports.dashboardGet = function(req, res) {
  res.render('admin/dashboard', {
    layout: 'layouts/admin',
    title: 'Dashboard',
    nav: 'dashboard'
  });
};

/*
exports.getAllBeers = function(req, res) {
  // Use the Beer model to find all beer
  Beer.find(function(err, beers) {
    if (err)
      res.send(err);

    res.json(beers);
  });
};
*/

exports.getNewUser = function(req, res) {
  res.render('admin/newuser', {
    layout: 'layouts/admin',
    title: 'Create a new user',
    nav: 'newuser'
  });
};

exports.generateFakelUsers = function(req, res, next) {
  // default is 10 users
  var qtt = 10;
  if(req.query.qtt !== undefined && req.query.qtt != '' && !Number.isNaN(Number(req.query.qtt)) ) {
    qtt = Number(req.query.qtt);
  }
  for (var i = 0; i < qtt; i++) {
    var user = new User({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    });
    user.save(function(err) {
      if (err) throw err
    })
  }
  res.redirect('/admin');
}

exports.getAllUsers = function(req, res) {

  // get page value
  var page = 1;
  var limit = 10;
  var maxLinks = 2; // Number of links to show on each side of current pagination link
  if(req.query.page !== undefined && req.query.page != '' && !Number.isNaN(Number(req.query.page)) && Number(req.query.page) > 0) {
    page = Number(req.query.page);
  }

  // https://github.com/edwardhotchkiss/mongoose-paginate
  User.paginate({}, { page: page, limit: limit }, function(err, result) {
    if (err)
      res.send(err);

    //res.json(result);
    res.render('admin/users', {
      layout: 'layouts/admin',
      title: 'Users',
      nav: 'users',
      maxLinks: maxLinks,
      result: result
    });
  });

  /*
  res.render('admin/users', {
    layout: 'layouts/admin',
    title: 'Users',
    nav: 'users'
  });
  */
};
