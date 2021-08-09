const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync')
const userController = require('../controllers/userController');

//Access to the register form
router.get('/register', userController.registerUser);

router.post('/register', catchAsync(userController.createUser));

router.get('/login', userController.loginForm);

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}) ,userController.loginUser);

router.get('/logout', userController.logoutUser);   


module.exports = router;

