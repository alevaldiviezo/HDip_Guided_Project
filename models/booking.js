const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    // body: String,
    // rating: Number,
    service: String,
    fullname: String,
    address : String,
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


module.exports = mongoose.model('Booking', bookingSchema);