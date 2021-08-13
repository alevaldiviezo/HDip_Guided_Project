// Libraries required
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// New schema saved in bookingSchema
const bookingSchema = new Schema({

    // Fields required to create a booking
    service: String,
    fullname: String,
    address : String,
    phone: Number,
    date: Date,
    price: Number,
    created: {
        type: Date,
        default: Date.now()
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['submitted', 'in progress', 'available'],
        default: 'submitted',
    }
});


module.exports = mongoose.model('Booking', bookingSchema); // Export the model as Booking