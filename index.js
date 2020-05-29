const express          = require("express"),
      app              = express(),
      bodyParser       = require("body-parser"),
      methodOverride   = require('method-override'),
      expressSanitizer = require('express-sanitizer'),
      mongoose         = require("mongoose"),
      Campground       = require("./models/campground"),
      Comment          = require('./models/comment'),
      seedDB           = require('./seeds');

seedDB();
app.set("view engine", "ejs");
app.use(methodOverride('_method'));
app.use(express.static('/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
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

// =====================
// ADD COMMENTS ROUTE
// =====================

app.put('/campgrounds/:id', async (req, res) => {
  const { text, author } = req.body.comment;
  try {
    const campground = await Campground.findById(req.params.id);
    const comment = await Comment.create({
      text: req.sanitize(text),
      author: req.sanitize(author)
    });
    
    campground.comments.push(comment);
    campground.save();
    res.redirect(`/campgrounds/${req.params.id}`);
  } catch (error) {
    console.log(error);
  }
});

// Server init
app.listen(process.env.PORT || 3000, () => console.log("Served YelpCamp"));
