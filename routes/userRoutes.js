const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync')
const userController = require('../controllers/userController');

//Access to the register form
router.get('/register', userController.registerUser);

// Register user in the DB
router.post('/register', catchAsync(userController.createUser));

// Access to login form
router.get('/login', userController.loginForm);

// login a user
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}) ,userController.loginUser);

//logout a user
router.get('/logout', userController.logoutUser);   


module.exports = router;

