const express = require('express');
const router = express.Router( {mergeParams: true}); // we add this attribute because router keep the params separated
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Booking = require('../models/booking');
const Service = require('../models/service');
const {serviceSchema, reviewSchema} = require('../schemas');
const {validateBooking, isLoggedIn, isBookingAuthor, isAdmin} = require('../middleware');
const myBookingController = require('../controllers/myBookingController');

// Access to all bookings
router.get('/', isLoggedIn, catchAsync(myBookingController.mybookingIndex));



//see one booking
router.get('/:bookingId', isLoggedIn, isBookingAuthor, catchAsync(myBookingController.showBooking));

//Generate the invoice
router.get('/:bookingId/generateReport', isLoggedIn, isAdmin, myBookingController.generateReport);

//access a form to edit a booking
router.get('/:bookingId/bookingEdit', isLoggedIn, isBookingAuthor, catchAsync(myBookingController.editBooking));

//Update a booking
router.put('/:bookingId', isLoggedIn, isBookingAuthor, catchAsync(myBookingController.updateBooking));

module.exports = router;