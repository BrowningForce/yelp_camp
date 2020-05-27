const express     = require("express"),
      app         = express(),
      bodyParser  = require("body-parser"),
      mongoose    = require("mongoose"),
      Campground  = require("./models/campground"),
      seedDB      = require('./seeds');

seedDB();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost:27017/yelp_camp", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
});

// ROUTERS
app.get("/", (req, res) => {
  res.render("landing");
});

// INDEX route - show all campgrounds
app.get("/campgrounds", async (req, res) => {
  try {
    const campgrounds = await Campground.find({});
    res.render("index", { campgrounds });
  } catch (error) {
    console.log(error);
  }
});

// NEW route - show form to add a campground
app.get("/campgrounds/new", (req, res) => {
  res.render("new");
});

// CREATE route - add new campground to database
app.post("/campgrounds", async (req, res) => {
  const { name, image, description } = req.body;

  try {
    await Campground.create(
      {
        name,
        image,
        description,
        // comments: [],
      }
    );
    res.redirect('/campgrounds');
  } catch (error) {
    console.log(error)
  }
});

//SHOW route
app.get("/campgrounds/:id", async (req, res) => {
  try {
    //find campground with the provided id
    const campground = await Campground.findById(req.params.id).populate('comments');
      // render SHOW template for found campground
    res.render("show", { campground });
  } catch (error) {
    console.log(error);
  }
});

// Server init
app.listen(process.env.PORT || 3000, () => console.log("Served YelpCamp"));
