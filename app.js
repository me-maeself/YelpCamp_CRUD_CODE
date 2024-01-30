// Server and database
const express = require("express");
const mongoose = require("mongoose");

// Package dependencies
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// Async and Error handler
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");

// Server schema validation
const { campgroundSchema, reviewSchema } = require("./schemas.js");

// Models
const Campground = require("./models/campground");
const Review = require("./models/review.js");
const User = require("./models/user.js");

// Routes
const userRoutes = require("./routes/user.js");
const campgroundRoutes = require("./routes/campgrounds.js");
const reviewRoutes = require("./routes/reviews.js");

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
// Public
app.use(express.static(path.join(__dirname, "public")));
// Session (cookies connect.sid)
const sessionConfig = {
	secret: "secretCode",
	resave: "false",
	saveUninitialized: "true",
	// Should have been mongoDB as the store {store:...}
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
};
app.use(session(sessionConfig));

// Flash
app.use(flash());

// Auth
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// All HTML
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	return next();
});

// Routing
app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

// Home
app.get("/", (req, res) => {
	res.render("home");
});

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
