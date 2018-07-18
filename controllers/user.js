// Load required packages
var User = require('../models/user');
var Token = require('../models/token');
var crypto = require('crypto');
var nodemailer = require('nodemailer');

// https://codemoto.io/coding/nodejs/email-verification-node-express-mongodb

exports.postUsers = function(req, res) {

  //  Validation rules
  req.checkBody('email', 'Enter a valid email address.').isEmail().normalizeEmail();
  req.checkBody('username', 'Username must not be empty').not().isEmpty()
    .trim()
    .escape();
  req.checkBody('password', 'Password must not be empty').not().isEmpty()
    .trim()
    .escape();

  var errors = req.validationErrors();

  if (errors) {
    res.status(400).send(errors);
    return;
  }

  var mailExists = User.findOne({ email: req.body.email }, function (errors, usermail) {
    if (errors) { return res.status(500).send(errors); }
    if (usermail !== null) {
      res.status(400).send({ msg: 'The email address you have entered is already associated with another account.' });
      return;
    } else {
      // there is no matching email in DB, now check for Username
      var userExists = User.findOne({ username: req.body.username }, function (errors, username) {
        if (errors) { return res.status(500).send(errors); }
        if (username !== null) {
          res.status(400).send({ msg: 'The username you have entered is already associated with another account.' });
          return;
        } else {
          // NOW DO REGISTER!
          var user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
          });
          user.save(function(err) {
            if (err) { return res.status(500).send({ msg: err.message }); }
            // Create a verification token for this user
            var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
            // Save the verification token
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
                res.status(200).send('A verification email has been sent to ' + user.email + '.');
              });
            });
          });
        }
      });
    }
  });
};

// Create endpoint /api/users for GET
exports.getUsers = function(req, res) {
  User.find(function(err, users) {
    if (err)
      res.send(err);

    res.json(users);
  });
};
