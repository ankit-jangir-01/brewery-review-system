const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema([
    {
        breweryId: {
            type: String,
            required: true
        },
        reviews: [
            {
                username: String,
                review: String,
                rating: Number
            }
        ]
    }
])

const Review = mongoose.model('reviews', reviewSchema);

module.exports = Review;