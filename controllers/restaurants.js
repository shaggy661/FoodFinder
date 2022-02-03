const Restaurant = require('../models/restaurant');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        const restaurants = await Restaurant.find({ $or: [{ title: regex} , {description: regex}, {address: regex}, {postcode: regex}, {city: regex}, {country: regex}, {cuisines: regex} ]});
        const searchQuery = req.query.search;
        res.render('restaurants/index', { restaurants, title: `FoodFinder: ${searchQuery}`, searchQuery })
    }else{
        const restaurants = await Restaurant.find({});
        const searchQuery = false;
        res.render('restaurants/index', { restaurants, title: "All Restaurants - FoodFinder", searchQuery })
    }
}

module.exports.renderNewForm = (req, res) => {
    res.render('restaurants/new');
}

module.exports.createRestaurant = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.restaurant.address + ', ' + req.body.restaurant.postcode + ', ' + req.body.restaurant.city + ', ' + req.body.restaurant.country,
        limit: 1,
    }).send()
    const restaurant = new Restaurant(req.body.restaurant);
    restaurant.geometry = geoData.body.features[0].geometry;
    restaurant.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    restaurant.author = req.user._id;
    await restaurant.save();
    console.log(restaurant);
    req.flash('success', 'Successfully made a new restaurant!');
    res.redirect(`/restaurants/${restaurant._id}`);
}

module.exports.showRestaurant = async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!restaurant) {
        req.flash('error', 'Cannot find that restaurant');
        return res.redirect('/restaurants');
    }
    res.render('restaurants/show', { restaurant });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id)
    if (!restaurant) {
        req.flash('error', 'Cannot find that restaurant');
        return res.redirect('/restaurants');
    }
    res.render('restaurants/edit', { restaurant })
}

module.exports.updateRestaurant = async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndUpdate(id, { ...req.body.restaurant });
    const geoData = await geocoder.forwardGeocode({
        query: req.body.restaurant.address + ', ' + req.body.restaurant.postcode + ', ' + req.body.restaurant.city + ', ' + req.body.restaurant.country,
        limit: 1,
    }).send()
    restaurant.geometry = geoData.body.features[0].geometry;
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    restaurant.images.push(...imgs);
    await restaurant.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await restaurant.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated restaurant!')
    res.redirect(`/restaurants/${restaurant._id}`);
}

module.exports.deleteRestaurant = async (req, res) => {
    const { id } = req.params;
    await Restaurant.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted restaurant!');
    res.redirect('/restaurants');
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}