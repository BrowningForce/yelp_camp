const express          = require("express"),
      app              = express(),
      bodyParser       = require("body-parser"),
      methodOverride   = require('method-override'),
      expressSanitizer = require('express-sanitizer'),
      mongoose         = require("mongoose"),
      expressSession   = require('express-session'),
      passport         = require('passport'),
      LocalStrategy    = require('passport-local'),
      Campground       = require("./models/campground"),
      Comment          = require('./models/comment'),
      User             = require('./models/user'),
      seedDB           = require('./seeds');

seedDB();
app.set("view engine", "ejs");
app.use(methodOverride('_method'));
app.use('/assets', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
mongoose.connect("mongodb://localhost:27017/yelp_camp", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
});

// PASSPORT CONFIG
app.use(expressSession({
  secret: 'Wow, how did you get here?',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//MIDDLEWARE
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// ROUTES
app.get("/", (req, res) => {
  res.render("landing");
});

// INDEX route - show all campgrounds
app.get("/campgrounds", async (req, res) => {
  try {
    const campgrounds = await Campground.find({});
    res.render("index", { campgrounds, currentUser: req.user });
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

app.put('/campgrounds/:id', isLoggedIn, async (req, res) => {
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

// Auth route
app.get('/register', (req, res) => res.render('register'));
app.post('/register', async (req, res) => {
  try {
    await User.register(new User( {username: req.body.username} ), req.body.password);
    passport.authenticate('local', (req, res, () => {
      res.redirect('/campgrounds');
    }));
  } catch (error) {
    console.log(error);
    res.redirect('/register')
  }
});

app.get('/secret', isLoggedIn, (req, res) => res.send('this is a secret'));

// Login route
app.get('/login', (req, res) => res.render('login'));
app.post('/login', passport.authenticate('local', {
  successRedirect: '/campgrounds',
  failureRedirect: '/login'
}), (req, res) => {});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Server init
app.listen(process.env.PORT || 3000, () => console.log("Served YelpCamp"));
