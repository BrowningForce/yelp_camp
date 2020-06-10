const express    = require('express'),
      User       = require('../models/user'),
      passport   = require('passport'),
      router     = express.Router();

// ROUTES
router.get("/", (req, res) => {
    res.render("landing");
  });

// Auth route
router.get('/register', (req, res) => res.render('register'));
router.post('/register', async (req, res) => {
  try {
    await User.register(new User( {username: req.body.username} ), req.body.password);
    passport.authenticate('local', (req, res, () => {
      res.redirect('/campgrounds');
    }));
    res.redirect('/campgrounds');
  } catch (error) {
    console.log(error);
    res.redirect('/register')
  }
});

// Login route
router.get('/login', (req, res) => res.render('auth/login'));
router.post('/login', passport.authenticate('local', {
  successRedirect: '/campgrounds',
  failureRedirect: '/login'
}), (req, res) => {});


// Logout route
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;