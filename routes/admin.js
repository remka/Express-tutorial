var express = require('express');
var beerController = require('../controllers/beer');
var userController = require('../controllers/user');
var authController = require('../controllers/auth');
var adminController = require('../controllers/admin');
var router = express.Router();

//
router.route('/')
  .get(adminController.dashboardGet);

router.route('/users/')
  .get(adminController.getAllUsers);

router.route('/newuser')
  .get(adminController.getNewUser);

router.route('/users/fake')
  .get(adminController.generateFakelUsers);


module.exports = router;
