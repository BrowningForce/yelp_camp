const express          = require('express'),
      Campground       = require('../models/campground'),
      Comment          = require('../models/comment'),
      expressSanitizer = require('express-sanitizer'),
      middleware       = require('../middleware'),
      router           = express.Router();

// INDEX route - show all campgrounds
router.get("/", async (req, res) => {
    try {
      const campgrounds = await Campground.find({});
      res.render("index", { campgrounds, currentUser: req.user });
    } catch (error) {
      console.log(error);
    }
});
  
// NEW route - show form to add a campground
router.get("/new", middleware.isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});
  
  // CREATE route - add new campground to database
router.post("/", middleware.isLoggedIn, async (req, res) => {
  const { name, image, description } = req.body,
        { id, username }             = req.user;

  try {
    await Campground.create(
      {
        name,
        image,
        description,
        author: {
          id,
          username
        }
      }
    );
    res.redirect('/campgrounds');
  } catch (error) {
    console.log(error)
  }
});
  
//SHOW route
router.get("/:id", async (req, res) => {
  try {
    //find campground with the provided id
    const campground = await Campground.findById(req.params.id).populate('comments');
      // render SHOW template for found campground
    res.render("campgrounds/show", { campground });
  } catch (error) {
    console.log(error);
  }
});

//EDIT ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnhership, async (req, res) => {
  try {
      const campground = await Campground.findById(req.params.id);
        res.render('campgrounds/edit', { campground });
    } catch (error) {
      console.log(error);
      res.redirect('back');
    }
  
});
router.put('/:id', middleware.checkCampgroundOwnhership, async (req, res) => {
  try {
    await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
    res.redirect(`/campgrounds/${req.params.id}`);        
  } catch (error) {
    console.log(error);
    res.redirect(`/campgrounds/${req.params.id}`);
  }
});

//DELETE ROUTE
router.delete('/:id', middleware.checkCampgroundOwnhership, async (req, res) => {
  try {
    await Campground.findByIdAndRemove(req.params.id);
    await Comment.deleteMany({
      _id: { $in: Campground.findById(req.params.id).comments }
    });
    res.redirect('/campgrounds');
  } catch (error) {
    console.log(error);
    res.redirect(`/campgrounds/${req.params.id}`);
  }
});

module.exports = router;
