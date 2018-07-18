var express = require('express');
var beerController = require('../controllers/beer');
var userController = require('../controllers/user');
var authController = require('../controllers/auth');
var router = express.Router();

//
router.route('/login')
  .get(authController.loginGet);

module.exports = router;
