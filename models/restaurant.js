const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200,h_200,c_crop,c_fill');
})

ImageSchema.virtual('imgToDisplay').get(function () {
    return this.url.replace('/upload', '/upload/w_1024,h_768,c_crop,c_fill');
})

const opts = { toJSON: { virtuals: true } };

const RestaurantSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    minprice: Number,
    maxprice: Number,
    description: String,
    address: String,
    postcode: String,
    city: String,
    country: String,
    website: {
        type: String
    },
    telephone: String,
    email: {
        type: String
    },
    cuisines: [String],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

RestaurantSchema.virtual('location').get(function(){
    return this.address + ', ' + this.postcode + ', ' + this.city + ', ' + this.country
})

RestaurantSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/restaurants/${this._id}">${this.title}</a></strong>
    <p>${this.location}</p>`;
})

RestaurantSchema.virtual('reviewNumber').get(function () {
    return this.reviews.length;
})

RestaurantSchema.virtual('reviewAverage').get(function () {
    let average = 0;
    if (this.reviews.length > 0) {
        let sum = 0;
        for (let review of this.reviews) {
            sum += review.rating
        }
        average = sum / this.reviews.length;
        let f = Math.floor(average);
        if (average - f < 0.5) {
            average = f;
        } else (
            average = f + 0.5
        )
    } else { average = 0 }
    return average;
})

RestaurantSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Restaurant', RestaurantSchema);