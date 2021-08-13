const Review = require('../models/review');

//Create a review
module.exports.addReview = async (req, res) => {  // we use catchAsync to catch a possible error and avoid to use try-catch
    const review = new Review(req.body.review);
    review.author = req.user;  // We save the author's name from user
    
    await review.save();
    req.flash('success', 'Review created successfully!')
    res.redirect('/');
};

//Delete a review
module.exports.deleteReview = async(req, res) => {
    const {reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted !');
    res.redirect('/');
};