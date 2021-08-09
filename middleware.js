const {serviceSchema, reviewSchema, bookingSchema} = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Service = require('./models/service');
const Booking = require('./models/booking');
const Review = require('./models/review');
const User = require('./models/user');

module.exports.isLoggedIn = (req, res, next) => {
    
    if(!req.isAuthenticated()){
            req.session.returnTo = req.originalUrl;  // Store the url the user is requesting
            req.flash('error', 'You must be logged to do that');
            return res.redirect('/login');
        
    }
    next();
}

//middleware to validate a service

module.exports.validateService = (req, res, next) => {

    const {error} = serviceSchema.validate(req.body);
        if (error){
            const msg = error.details.map(el => el.message).join(',')
            throw new ExpressError(msg, 400);
        }else{
            next();
        }
}

module.exports.isAuthor = async(req, res, next) => {
    const {id} = req.params;
    const service = await Service.findById(id);
    if(!service.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/services/${id}`);
    }
    next();
}

module.exports.isBookingAuthor = async(req, res, next) => {
    const {bookingId, id} = req.params;
    const booking = await Booking.findById(bookingId);
    if(!booking.author.equals(req.user._id) && req.user.role != 'admin' ) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/services/${id}`);
    }
    
    next();
}

//middleware to check if the user is an admin

module.exports.isAdmin = async(req, res, next) => {
    // const {id} = req.params;
    // const user = await User.findById(id);
    if(req.user.role != 'admin'){
        req.flash('error','you are not allowed to do that!');
        return res.redirect('/services');
    }
    next();
}

//middleware to validate a booking
module.exports.validateBooking = (req, res, next) => {
    const {error} = bookingSchema.validate(req.body);
    if(error){
            const msg = error.details.map(el => el.message).join(',');
            throw new ExpressError(msg, 400)
    }else{
        next();
    }
};

//middleware to validate a review
module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
            const msg = error.details.map(el => el.message).join(',');
            throw new ExpressError(msg, 400)
    }else{
        next();
    }
};

module.exports.isReviewAuthor = async(req, res, next) => {
    const {reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id) && req.user.role != 'admin'){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect('/');
    } 
    
        next();
}
