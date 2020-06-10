const Campground = require('../models/campground'),
      Comment    = require('../models/comment');

const middleware = {
    checkCampgroundOwnhership: async function (req, res, next) {
        if(req.isAuthenticated()) {
          try {
            const campground = await Campground.findById(req.params.id);
            if (campground.author.id.equals(req.user._id)) {
              next();
            } else {
              res.redirect('back');
            }
          } catch (error) {
            console.log(error);
            res.redirect('back');
          }
        } else {
          res.redirect('/login');
        }
      },

      checkCommentOwnhership: async function(req, res, next) {
        if(req.isAuthenticated()) {
          try {
            const comment = await Comment.findById(req.params.commentID);
            if (comment.author.id.equals(req.user._id)) {
              next();
            } else {
              res.redirect('back');
            }
          } catch (error) {
            console.log(error);
            res.redirect('back');
          }
        } else {
          res.redirect('/login');
        }
      },

    isLoggedIn:  function(req, res, next) {
        if (req.isAuthenticated()) return next();
        res.redirect('/login');
    }
}

module.exports = middleware;