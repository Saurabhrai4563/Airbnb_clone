const express = require("express")
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const Review = require("../models/review.js")
const { validateReview, isLoggedIn } = require("../middleware.js")
router.post("/", isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    //console.log(req.params.id);
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review);
    newReview.auther = req.user._id;
    //console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`)
}))

//Delete Review Route

router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))

module.exports = router;