const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Campground = require("./models/campground");

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

app.get("/campgrounds/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const campground = await Campground.findById(id);
		res.render("campgrounds/show", { campground });
	} catch (e) {
		res.send(`cant find camp`);
	}
});

app.listen(3000, () => {
	console.log("(Express) Serving on 3000.");
});
