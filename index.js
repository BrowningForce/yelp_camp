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

// ROUTING SETUP
const campgroundRoutes = require('./routes/campgrounds'),
      commentRoutes    = require('./routes/comments'),
      authRoutes       = require('./routes/auth');

// UNCOMMENT THIS IF YOU WANT TO FLUSH DB AND START WITH SAMPLE DB
// seedDB();

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
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use(authRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', commentRoutes);

// Server init
app.listen(process.env.PORT || 3000, () => console.log("Served YelpCamp"));
