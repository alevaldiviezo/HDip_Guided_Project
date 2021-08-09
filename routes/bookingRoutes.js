const express = require('express');
const router = express.Router( {mergeParams: true}); // we add this attribute because router keep the params separated
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Booking = require('../models/booking');
const Service = require('../models/service');
const {serviceSchema, reviewSchema} = require('../schemas');
const {validateBooking, isLoggedIn, isBookingAuthor} = require('../middleware');
const bookingController = require('../controllers/bookingController');



//add a boking
router.post('/', isLoggedIn, validateBooking, catchAsync(bookingController.createBooking));

// Delete a booking
router.delete('/:bookingId', isLoggedIn, isBookingAuthor, catchAsync(bookingController.deleteBooking));


module.exports = router;