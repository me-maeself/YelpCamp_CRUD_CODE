This is project is based on **Web Development BootCamp 2023** by **Colt Steele** in **Udemy**. Section 39: YelpCamp: Campgrounds CRUD.
`21/01/2023 by **me-maeself**`
---
#### Learn new import & export
  `import {name as newName} from "..."`
  `export const name = 'value`
  `import newName from "..."`
  `export default "value"`

#### learn path
  - create `jsconfig.json` file
    - Map paths 
    ```js
    {
      "compilerOptions": {
        "baseUrl": "./",
        "paths": {
          "@components/*" : ["components/*"],
          "@style/*" : ["styles/*"],
          "@lib" : ["lib/*"],
        }
      }
    }
    ```
    - use it with @
      - `@lib/*/*`

<!-- TODO Make api usage for Unsplash -->
  <!-- Make unsplash acc -->
  <!-- Read api description and limits -->
  try getting one request

  Look at the db schema
  Make a seed function
    Use api limit based on the criterion
      First trial


## Overview
Features of the YelpCamp project:
- Map
- Locations
- Authentication
- Creation
- Indexing

## 419. How to access YelpCamp Code
- the resource button direct us to a specific commit in github repo.

## 420. Creating Basic Express App
- npm init
- npm i express ejs mongoose 

## 421. Campground: Model Basic
- making views
  - home.ejs
- making models
  - campground
- making home route
- making makecampground route

## 422. Campground: Seeding
- created seeds directory
  - made index.js
    - seed 50 campground
      - location
      - description

## 423. Campground: Index
- created /campgrounds route
- mkdir views/campgrounds
  - code index.js
    - list all title

![423.png](./assets/423.png)

## 424. Campgrounds: Show
- create show detailed page of a campground via campgrounds/:id
  - edited app.js
  - try and catch id
  - created show.ejs

## 425. Campgrounds: New
- get and post route handling on app.js
- new.ejs
- added navigation button on each page
- app.use(express.urlencoded({ extended: true }));

## 426. Campground: Edit and Update
- npm i method-override
  - const methodOverride = require("method-override");
  - app.use(methodOverride("_method"));
- edit.ejs

## 427. Campground: Delete
- app.delete("/campgrounds/:id")

## Final result:
![Screenshot 2024-01-21 175332.png](./assets/Screenshot 2024-01-21 175332.png)
![Screenshot 2024-01-21 175340.png](./assets/Screenshot 2024-01-21 175340.png)
![Screenshot 2024-01-21 175346.png](./assets/Screenshot 2024-01-21 175346.png)
![Screenshot 2024-01-21 175357.png](./assets/Screenshot 2024-01-21 175357.png)

---
Beginning of Part 2. Section 41: YelpCamp: Adding Basic Styles.

## 436. New EJS tools for layout
Injection and boilerplate
- ejs-mate
  - layout
    - Boilerplate
```html
<!-- views/layouts/boilerplate.ejs -->
<body>
		<%- body %>
</body>

<!-- All other files -->
<% layout('layouts/boilerplate') %>
...body...
```

## 437. Bootstrap CDN
- Check documentation
- Adding bootstrap to boilerplate
  
## 438. Navbar
- Adding navbar via partials
  
## 439. Footer
- Adding footer via partials
- Making body 100vh and flex-box
- footer sticky-bottom

## 440. Img
Need to populate the website with image API from unsplash

```js
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
```

## 441. Index
...just bootstrap

## 442. New Form
...just bootstrap

## 443. Edit Form
...just bootstrap

## 444. Show page
...just bootstrap

end of part 2
---

# Part 3 -> Error Handling
- Client side error handling
- Server side error handling
- Send back error from server to client
- Joi

## 454. Client side form validation (Bootstrap)
- use required `properties` in `<form>` tag
- Use Bootstrap validation
  - invalidate
  - js script

## 455. Basic error handling
- app.use(err, req, res, next){res.send(errMsg)}

## More Error