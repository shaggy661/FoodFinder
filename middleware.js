const { restaurantSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Restaurant = require('./models/restaurant');
const { reviewSchema } = require('./schemas.js');
const Review = require('./models/review');
const restaurant = require('./models/restaurant');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    if (!restaurant.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that.');
        return res.redirect(`/restaurants/${id}`);
    }
    next();
}

//checks for error server side
module.exports.validateRestaurant = (req, res, next) => {
    if( !Array.isArray(req.body.restaurant.cuisines) ){
        const temp = req.body.restaurant.cuisines;
        req.body.restaurant.cuisines = new Array();
        req.body.restaurant.cuisines.push(temp);
    }
    
    const { error } = restaurantSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that.');
        return res.redirect(`/restaurants/${id}`);
    }
    next();
}

