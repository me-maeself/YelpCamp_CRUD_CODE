const express = require("express");
const router = express.Router({ mergeParams: true });

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const Review = require("../models/review.js");
const Campground = require("../models/campground.js");

const {
	validateReview,
	isLoggedIn,
	isAuthor,
	isReviewAuthor,
} = require("../middleware.js");

router.post(
	"/",
	isLoggedIn,
	validateReview,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findById(id);

		const review = new Review(req.body.review);
		// Inside review.body -> req.body.review.rating & req.body.review.body
		review.author = req.user._id;
		campground.reviews.push(review);

		await review.save();
		await campground.save();

		req.flash("success", "Created new review!");
		res.redirect(`/campgrounds/${id}`);
	})
);

router.delete(
	"/:reviewId",
	isLoggedIn,
	isReviewAuthor,
	catchAsync(async (req, res) => {
		const { id, reviewId } = req.params;
		await Campground.findByIdAndUpdate(id, {
			$pull: { reviews: reviewId },
		});
		await Review.findByIdAndDelete(reviewId);
		req.flash("success", "Successfully deleted a review.");
		res.redirect(`/campgrounds/${id}`);
	})
);

module.exports = router;
