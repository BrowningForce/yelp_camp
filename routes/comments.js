const express       = require('express'),
      Campground    = require('../models/campground'),
      Comment       = require('../models/comment'),
      middleware    = require('../middleware'),
      router        = express.Router({mergeParams: true});

// =====================
// ADD COMMENTS ROUTE
// =====================

router.post('/new', middleware.checkCommentOwnhership, async (req, res) => {
    const { text, author }  = req.body,
          { _id, username } = req.user;
    try {
      const campground = await Campground.findById(req.params.id);
      const comment = await Comment.create({
        text: req.sanitize(text),
        author: req.sanitize(author)
      });

      // add username & id to comments
      comment.author.id = _id;
      comment.author.username = username;
      comment.save();
      
      campground.comments.push(comment);
      campground.save();
      res.redirect(`/campgrounds/${req.params.id}`);
    } catch (error) {
      console.log(error);
    }
  });

router.put('/:commentID', middleware.checkCommentOwnhership, async (req, res) => {
  try {
    await Comment.findByIdAndUpdate(req.params.commentID, req.body);
    res.redirect(`/campgrounds/${req.params.id}`);
  } catch (error) {
    console.log(error);
    res.redirect('/campgrounds');
  }
});


router.delete('/:commentID', middleware.checkCommentOwnhership, async (req, res) => {
  try {
    await Comment.findByIdAndRemove(req.params.commentID);
    res.redirect(`/campgrounds/${req.params.id}`);
  } catch (error) {
    console.log(error);
    res.redirect('back');
  }
});

module.exports = router;