const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Campground = require("./models/campground");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const { campgroundSchema, reviewSchema } = require("./schemas.js");
const Review = require("./models/review.js");

main()
	.then(() => {
		console.log("(mongoose) Database Connected.");
	})
	.catch((err) => console.log(err));

async function main() {
	await mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
}

const app = express();
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
	res.render("home");
});

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

app.get("/makecampground", async (req, res) => {
	const camp = new Campground({
		title: "My Backyard",
		description: "Cheap Camping",
	});
	await camp.save();
	res.send(camp);
});

app.get("/campgrounds", async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render(`campgrounds/index`, { campgrounds });
});

app.get("/campgrounds/new", (req, res) => {
	res.render("campgrounds/new");
});

app.post(
	"/campgrounds",
	validateCampground,
	catchAsync(async (req, res, next) => {
		const campground = new Campground(req.body.campground);
		await campground.save();
		res.redirect(`campgrounds/${campground._id}`);
	})
);

app.get(
	"/campgrounds/:id",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findById(id).populate("reviews");
		res.render("campgrounds/show", { campground });
	})
);

// POST /campgrounds/:id/reviews
app.post(
	"/campgrounds/:id/reviews",
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

app.delete(
	"/campgrounds/:id/reviews/:reviewId",
	catchAsync(async (req, res) => {
		const { id, reviewId } = req.params;
		await Campground.findByIdAndUpdate(id, {
			$pull: { reviews: reviewId },
		});
		await Review.findByIdAndDelete(reviewId);
		res.redirect(`/campgrounds/${id}`);
	})
);

app.get(
	"/campgrounds/:id/edit",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findById(id);
		res.render("campgrounds/edit", { campground });
	})
);

app.put(
	"/campgrounds/:id",
	validateCampground,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		try {
			const campground = await Campground.findByIdAndUpdate(id, {
				...req.body.campground,
			});
			res.redirect(`/campgrounds/${campground._id}`);
		} catch (error) {
			res.send(`cant find camp`);
		}
	})
);

app.delete(
	"/campgrounds/:id",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		try {
			await Campground.findByIdAndDelete(id);
			res.redirect("/campgrounds");
		} catch (error) {
			console.log(error);
			res.send(`cant find camp`);
		}
	})
);

app.get("/pic", (req, res) => {
	let picture = {};

	fetch(
		"https://api.unsplash.com/photos/random?client_id=QDysHD22BOxCA_pY5negmAAwa5wf_QEg-2JXhcZ0CsY&collections=957079"
	)
		//"https://api.unsplash.com/photos/random?client_id=&collections=ID"
		.then((data) => {
			picture = data.json();
			return picture;
		})
		.then((p) => {
			res.redirect(p.urls.regular);
		})
		.catch((e) => console.log(e));
});

app.all("*", (req, res, next) => {
	return next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) {
		err.message = "Error: Something unexpected happen!";
	}
	res.status(statusCode).render("error", { err, statusCode });
});

app.listen(3000, () => {
	console.log("(Express) Serving on 3000.");
});
