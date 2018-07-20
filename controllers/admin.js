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
    flashErrors: req.flash('errors'),
    flashSuccess: req.flash('success'),
    form: req.flash('form')[0],
    nav: 'newuser'
  });
  req.session.errors = null;
};

exports.postNewUser = function(req, res) {

  //  Validation rules

  var email = req.body.inputEmail;
  var username = req.body.inputUsername;
  var password = req.body.inputPassword;
  var isApproved = req.body.isApproved;

  req.checkBody('inputEmail', 'Enter a valid email address.').isEmail().normalizeEmail();
  req.checkBody('inputUsername', 'Username must not be empty').notEmpty()
    .trim()
    .escape();
  req.checkBody('inputPassword', 'Password must not be empty.').notEmpty()
    .trim()
    .escape();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    req.flash('form', req.body);
    res.redirect('/admin/newuser');
  } else {
    // now check if username mailExists
    var mailExists = User.findOne({ email: req.body.inputEmail }, function (errors, usermail) {
      if (errors) { return res.status(500).send(errors); }
      if (usermail !== null) {
        req.flash('errors', { msg: 'The email address you have entered is already associated with another account.' });
        req.flash('form', req.body);
        res.redirect('/admin/newuser');
      } else {
        var userExists = User.findOne({ username: req.body.username }, function (errors, username) {
          if (errors) { return res.status(500).send(errors); }
          if (username !== null) {
            req.flash('errors', { msg: 'The username you have entered is already associated with another account.' });
            req.flash('form', req.body);
            res.redirect('/admin/newuser');
          } else {
            // now save the user

            if (req.body.isApproved == 'on') {
              // user is pre-approved
              var user = new User({
                username: req.body.inputUsername,
                email: req.body.inputEmail,
                password: req.body.inputPassword,
                isVerified: true
              });
              user.save(function(err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                req.flash('success', 'The user has been added to the database and approved.');
                res.redirect('/admin/newuser');
              });
            } else {
              // user is not pre-approved
              var user = new User({
                username: req.body.inputUsername,
                email: req.body.inputEmail,
                password: req.body.inputPassword
              });
              user.save(function(err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
                token.save(function (err) {
                  if (err) { return res.status(500).send({ msg: err.message }); }
                  var transporter = nodemailer.createTransport({
                    host: process.env.MAIL_HOST,
                    port: process.env.MAIL_PORT,
                    auth: {
                      user: process.env.MAIL_USERNAME,
                      pass: process.env.MAIL_PASSWORD
                    }
                  });
                  var mailOptions = {
                    from: 'no-reply@yourwebapplication.com',
                    to: user.email,
                    subject: 'Account Verification Token',
                    text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/auth\/confirmation\/' + token.token + '.\n'
                  };
                  transporter.sendMail(mailOptions, function (err) {
                    if (err) { return res.status(500).send({ msg: err.message }); }
                    req.flash('success', 'The user has been added to the database. A mail has been sent with a verification link.');
                    res.redirect('/admin/newuser');
                  });
                });
              });
            }
          }
        });
      }
    });
  }
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
