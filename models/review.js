const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new mongoose.Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        // required: [true, 'User is required']
    },
    
});

module.exports = mongoose.model('Review', reviewSchema);