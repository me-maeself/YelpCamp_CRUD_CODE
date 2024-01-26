const express = require("express");
const router = express.Router({ mergeParams: true });

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const Review = require("../models/review.js");
const Campground = require("../models/campground.js");

const { reviewSchema } = require("../schemas.js");

const validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		console.log(msg);
		throw new ExpressError(msg, 400);
	} else {
		return next();
	}
};

router.post(
	"/",
	validateReview,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findById(id);

		const review = new Review(req.body.review);
		// req.body.review.rating
		// req.body.review.body
		campground.reviews.push(review);

		await review.save();
		await campground.save();

		res.redirect(`/campgrounds/${id}`);
	})
);

router.delete(
	"/:reviewId",
	catchAsync(async (req, res) => {
		const { id, reviewId } = req.params;
		await Campground.findByIdAndUpdate(id, {
			$pull: { reviews: reviewId },
		});
		await Review.findByIdAndDelete(reviewId);
		res.redirect(`/campgrounds/${id}`);
	})
);

module.exports = router;
