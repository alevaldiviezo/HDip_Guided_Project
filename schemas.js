const Joi = require('joi');

module.exports.serviceSchema = Joi.object({   // we use Joi to define all the fields required
        service: Joi.object({
            name: Joi.string().required(),
            description: Joi.string().required(),
            price: Joi.number().required().min(0)
        }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
});

module.exports.bookingSchema = Joi.object({
    booking: Joi.object({
        service: Joi.string(),
        fullname : Joi.string().required(),
        address: Joi.string().required(),
        date:Joi.date().min('now').required(),
        status: Joi.string()
    }).required()
});
