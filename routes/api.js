var express = require('express');
var beerController = require('../controllers/beer');
var userController = require('../controllers/user');
var authController = require('../controllers/auth');
var router = express.Router();

// Grab all beers
router.route('/beers/all')
  .get(beerController.getAllBeers);

// Create endpoint handlers for /beers
router.route('/beers')
  .post(authController.isAuthenticated, beerController.postBeers)
  .get(authController.isAuthenticated, beerController.getBeers);

// Create endpoint handlers for /beers/:beer_id
router.route('/beers/:beer_id')
  .get(authController.isAuthenticated, beerController.getBeer)
  .put(authController.isAuthenticated, beerController.putBeer)
  .delete(authController.isAuthenticated, beerController.deleteBeer);

// Create endpoint handlers for /users
router.route('/users')
  .post(userController.postUsers)
  //.get(authController.isAuthenticated, userController.getUsers);
  .get(userController.getUsers);

module.exports = router;
