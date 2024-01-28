const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("../seeds/cities");
const { places, descriptors } = require("./seedHelpers");

main()
	.then(() => {
		console.log("(mongoose) Database Connected.");
	})
	.catch((err) => console.log(err));

async function main() {
	await mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
}

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	// await Campground.deleteMany({});

	for (let i = 0; i < 40; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const imageURL = await fetchPicture();
		const prc = Math.floor(Math.random() * 20) + 10;
		const camp = new Campground({
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			image: imageURL.urls.regular,
			description:
				// cSpell:disable
				"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque sunt quidem totam dolorem blanditiis! Delectus rerum numquam esse excepturi tenetur laboriosam, impedit aspernatur incidunt, suscipit dolorem molestias nobis enim cum.",
			// cSpell:enable
			price: prc,
		});
		await camp.save();
	}
};

const fetchPicture = async function () {
	const picture = await fetch(
		"https://api.unsplash.com/photos/random?client_id=QDysHD22BOxCA_pY5negmAAwa5wf_QEg-2JXhcZ0CsY&collections=957079"
	)
		//"https://api.unsplash.com/photos/random?client_id=&collections=ID"
		.then((data) => {
			return data.json();
		})
		.catch((e) => console.log(e));
	return picture;
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

seedDB().then(() => {
	mongoose.connection.close();
});
