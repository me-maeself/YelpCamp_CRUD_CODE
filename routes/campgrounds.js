const express = require("express");
const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const Campground = require("../models/campground");

const { campgroundSchema } = require("../schemas.js");
const { isLoggedIn } = require("../middleware.js");

const validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		console.log(msg);
		throw new ExpressError(msg, 400);
	} else {
		return next();
	}
};

router.get("/", async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render(`campgrounds/index`, { campgrounds });
});

router.get("/new", isLoggedIn, (req, res) => {
	res.render("campgrounds/new");
});

router.post(
	"/",
	isLoggedIn,
	validateCampground,
	catchAsync(async (req, res, next) => {
		const campground = new Campground(req.body.campground);
		await campground.save();
		req.flash("success", "Successfully made a new campground.");
		res.redirect(`campgrounds/${campground._id}`);
	})
);

router.get(
	"/:id",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findById(id).populate("reviews");
		if (!campground) {
			req.flash("error", "Cannot find that campground!");
			return res.redirect("/campgrounds");
		}
		res.render("campgrounds/show", { campground });
	})
);

router.get(
	"/:id/edit",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findById(id);
		if (!campground) {
			req.flash("error", "Cannot find that campground!");
			return res.redirect("/campgrounds");
		}
		res.render("campgrounds/edit", { campground });
	})
);

router.put(
	"/:id",
	isLoggedIn,
	validateCampground,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		try {
			const campground = await Campground.findByIdAndUpdate(id, {
				...req.body.campground,
			});
			req.flash("success", "Successfully updated campground!");
			res.redirect(`/campgrounds/${campground._id}`);
		} catch (error) {
			res.send(`cant find camp`);
		}
	})
);

router.delete(
	"/:id",
	isLoggedIn,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		try {
			await Campground.findByIdAndDelete(id);
			req.flash("success", "Successfully deleted a campground.");
			res.redirect("/campgrounds");
		} catch (error) {
			console.log(error);
			res.send(`cant find camp`);
		}
	})
);

module.exports = router;
