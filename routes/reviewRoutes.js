const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Service = require('../models/service');
const Review = require('../models/review');
const reviewController = require('../controllers/reviewController');
const {serviceSchema, reviewSchema} = require('../schemas');
const {isLoggedIn, validateService, isAuthor, isAdmin, validateReview, isReviewAuthor} = require('../middleware');



//Create a review in DB
router.post('/', isLoggedIn, validateReview, catchAsync(reviewController.addReview));

//Delete a review

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewController.deleteReview));

module.exports = router;