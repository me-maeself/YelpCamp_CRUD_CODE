// Server and database
const express = require("express");
const mongoose = require("mongoose");

// Package dependencies
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

// Async and Error handler
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");

// Server schema validation
const { campgroundSchema, reviewSchema } = require("./schemas.js");

// Models
const Campground = require("./models/campground");
const Review = require("./models/review.js");

// Routes
const campgrounds = require("./routes/campgrounds.js");
const reviews = require("./routes/reviews.js");

// Mongoose Database Connection
main()
	.then(() => {
		console.log("(mongoose) Database Connected.");
	})
	.catch((err) => console.log(err));
async function main() {
	await mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
}

// Express Application Settings
const app = express();
// File path
app.set("views", path.join(__dirname, "views"));
// Rendering packages
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
// HTTP packages
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
// Routing
app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);
// Public
app.use(express.static(path.join(__dirname, "public")));

// Home
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

// Some testing and API route
// app.get("/makecampground", async (req, res) => {
// 	const camp = new Campground({
// 		title: "My Backyard",
// 		description: "Cheap Camping",
// 	});
// 	await camp.save();
// 	res.send(camp);
// });

// app.get("/pic", (req, res) => {
// 	let picture = {};

// 	fetch(
// 		"https://api.unsplash.com/photos/random?client_id=QDysHD22BOxCA_pY5negmAAwa5wf_QEg-2JXhcZ0CsY&collections=957079"
// 	)
// 		//"https://api.unsplash.com/photos/random?client_id=&collections=ID"
// 		.then((data) => {
// 			picture = data.json();
// 			return picture;
// 		})
// 		.then((p) => {
// 			res.redirect(p.urls.regular);
// 		})
// 		.catch((e) => console.log(e));
// });

// 404 not found
app.all("*", (req, res, next) => {
	return next(new ExpressError("Page not found", 404));
});

// Error handling
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
