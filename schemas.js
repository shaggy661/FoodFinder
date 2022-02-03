const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.restaurantSchema = Joi.object({
    restaurant: Joi.object({
        title: Joi.string().required().escapeHTML(),
        minprice: Joi.number().required().min(0),
        maxprice: Joi.number().required().min(0),
        address: Joi.string().required().escapeHTML(),
        postcode: Joi.string().required().escapeHTML(),
        city: Joi.string().required().escapeHTML(),
        country: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML(),
        website: Joi.string().optional().allow('').escapeHTML(),
        telephone: Joi.string().required().escapeHTML(),
        email: Joi.string().optional().allow('').escapeHTML(),
        cuisines: Joi.array()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML()
    }).required()
})