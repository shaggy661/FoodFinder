const express = require("express");
const app = express();

app.get('/', (req,res) => {
    res.render('home');
})

app.listen(3000, ()=> {
    console.log('We are on port 3000');
})

const mongoose = require('mongoose');
const review = require("./models/review");

const RestaurantSchema = new Schema({
    title: String,
    description: String
})

module.exports = mongoose.model('Restaurant', RestaurantSchema);

app.get('/restaurants', async (req, res) => {
    const restaurants = await Restaurant.find({});
    res.render('restaurants/index', { restaurants })
});
app.get('/restaurants/new', (req, res) => {
    res.render('restaurants/new');
})

app.post('/restaurants', async (req, res) => {
    const restaurant = new Restaurant(req.body.restaurant);
    await restaurant.save();
    res.redirect(`/restaurants/${restaurant._id}`)
})

app.get('/restaurants/:id', async (req, res,) => {
    const restaurant = await Restaurant.findById(req.params.id)
    res.render('restaurants/show', { restaurant });
});

app.get('/restaurants/:id/edit', async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id)
    res.render('restaurants/edit', { restaurant });
})

app.put('/restaurants/:id', async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndUpdate(id, { ...req.body.restaurant });
    res.redirect(`/restaurants/${restaurant._id}`)
});

app.delete('/restaurants/:id', async (req, res) => {
    const { id } = req.params;
    await Restaurant.findByIdAndDelete(id);
    res.redirect('/restaurants');
})

app.post('/restaurants/:id/reviews', async(req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);
    const review = new review(req.body.review);
    restaurant.reviews.push(review);
    await review.save();
    await restaurant.save();
    res.redirect('/restaurants/${restaurant._id}');
})

app.delete('/restaurants/:id/reviews/:reviewId', catchAsync(async (req,res)=>{
    const {id, reviewId } = req.params;
    await Restaurant.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/restaurants/${id}`);
}))