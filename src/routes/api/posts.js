const express = require('express');
const router = express.Router();
const passport = require('passport');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const validatePostInput = require('../../validation/post');
const controller = require('../../controllers/posts.controller');

router.get('/test', controller.test);
router.post('/', passport.authenticate('jwt', {session: false}), controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.findById);
router.delete('/:id', passport.authenticate('jwt', { session: false }), controller.deleteById);

// @route   POST /api/posts/like/:id
// @desc    Like post by id route
// @access  Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ alreadyLike: 'User already liked this post' })
          }
          post.likes.unshift({ user: req.user.id });
          post.save().then(post => res.json(post))
        })
        .catch(err => res.status(404).json({
          nopostfound: 'No post found with this id'
        }))
    })
});

// @route   POST /api/posts/unlike/:id
// @desc    Like post by id route
// @access  Private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ notliked: 'You have not yet liked this post' })
          }
          const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.params.id);
          post.likes.splice(removeIndex, 1);
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({
          nopostfound: 'No post found with this id'
        }))
    })
});

// @route   POST /api/posts/comment/:id
// @desc    Comment post by id route
// @access  Private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  Post.findById(req.params.id)
    .then(post => {
      const newComment = {
        user: req.user.id,
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar
      }
      post.comments.unshift(newComment);
      post.save().then(post => res.json(post))
    })
    .catch(err => res.status(404).json({
      nopostfound: 'No post found with this id'
    }))
});

// @route   POST /api/posts/comment/:id/:comment_id
// @desc    Remove comment by id route
// @access  Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post.comments.filter(cmt => cmt._id.toString() === req.params.comment_id).length === 0) {
        return res.status(400).json({ commentNotFound: 'Comment not found' })
      }
      const removeIndex = post.comments.map(cmt => cmt._id.toString()).indexOf(req.params.comment_id);
      post.comments.splice(removeIndex, 1);
      post.save().then(post => res.json(post));
    })
    .catch(err => res.status(404).json({
      nopostfound: 'No post found with this id'
    }))
});

module.exports = router;