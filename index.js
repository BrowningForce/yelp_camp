const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost/yelp_camp", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

// DEFINE SCHEMA
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
});

// Set model 
const Campground = mongoose.model("Campground", campgroundSchema);

// ROUTERS
app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/campgrounds", (req, res) => {
  const campgrounds = Campground.find({}, (err, campgrounds) => {
    err ? console.log(err) : res.render("campgrounds", { campgrounds });
  });
});

app.get("/campgrounds/new", (req, res) => {
  res.render("new");
});

app.post("/campgrounds", (req, res) => {
  const { name, image } = req.body;

  Campground.create({
    name,
    image,
  },
    (err) => (err ? console.log(err) : res.redirect("/campgrounds")));
});


// Server init
app.listen(process.env.PORT || 3000, () => console.log("Served YelpCamp"));
