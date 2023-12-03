const express = require('express');
const jwt = require('jsonwebtoken');
const Review = require('./../DB/review.model')

const secretKey = "testkey123"

const router = express.Router();


router.post('/addReview', async (req, res) => {
    try {
        const breweryId = req.body.breweryId
        const token = req.body.authToken;
        const review = req.body.review;
        const rating = req.body.rating;

        const decoded = jwt.decode(token, secretKey);
        const username = decoded.email;

        const obj = await Review.findOne({ breweryId: breweryId })

        if (!obj) {
            const reviewObj = new Review({
                breweryId: breweryId,
                reviews: [
                    {
                        username: username,
                        review: review,
                        rating: rating
                    }
                ]
            })
            await reviewObj.save()
        }
        else {
            const reviewObj = await Review.findOne({ breweryId: breweryId })

            const newReview = {
                username,
                review,
                rating
            };

            if (reviewObj?.reviews.find(obj => obj.username === username)) {
                await Review.updateOne(
                    {
                        breweryId: breweryId,
                        "reviews.username": newReview.username
                    },
                    {
                        $set: {
                            "reviews.$.review": newReview.review,
                            "reviews.$.rating": newReview.rating
                        }
                    }
                );
            }
            else {
                await Review.updateOne(
                    { breweryId: breweryId },
                    {
                        $push: {
                            reviews: newReview
                        }
                    }
                )
            }
        }

        res.send("review saved")

    }
    catch (error) {
        console.error("error saving review: ", error)
    }
})


router.post('/getReviews', async (req, res) => {
    try {
        const breweryId = req.body.breweryId
        const token = req.body.authToken;

        const decoded = jwt.decode(token, secretKey);
        const username = decoded.email;

        const reviewObj = await Review.findOne({ breweryId: breweryId })

        if (!reviewObj) res.send({ userReview: null, allReviews: null })
        else {
            const userRewiew = reviewObj.reviews.find(item => item.username === username);
            res.send({userReview: userRewiew, allReviews: reviewObj.reviews})
        }
    }
    catch (error) {
        console.error("error fetching reviews: ", error)
    }
})

module.exports = router;
