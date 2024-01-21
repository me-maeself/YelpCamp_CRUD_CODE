const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Campground = require("./models/campground");
const methodOverride = require("method-override");
const campground = require("./models/campground");

main()
	.then(() => {
		console.log("(mongoose) Database Connected.");
	})
	.catch((err) => console.log(err));

async function main() {
	await mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
}

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
	res.render("home");
});

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

app.post("/campgrounds", async (req, res) => {
	const campground = new Campground(req.body.campground);
	await campground.save();
	res.redirect(`campgrounds/${campground._id}`);
});

app.get("/campgrounds/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const campground = await Campground.findById(id);
		res.render("campgrounds/show", { campground });
	} catch (e) {
		res.send(`cant find camp`);
	}
});

app.get("/campgrounds/:id/edit", async (req, res) => {
	const { id } = req.params;
	const campground = await Campground.findById(id);
	res.render("campgrounds/edit", { campground });
});

app.put("/campgrounds/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const campground = await Campground.findByIdAndUpdate(id, {
			...req.body.campground,
		});
		res.redirect(`/campgrounds/${campground._id}`);
	} catch (error) {
		res.send(`cant find camp`);
	}
});

app.delete("/campgrounds/:id", async (req, res) => {
	const { id } = req.params;
	try {
		await Campground.findByIdAndDelete(id);
		res.redirect("/campgrounds");
	} catch (error) {
		res.send(`cant find camp`);
	}
});

app.listen(3000, () => {
	console.log("(Express) Serving on 3000.");
});
