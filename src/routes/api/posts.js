const express = require('express');
const router = express.Router();
const passport = require('passport');
const controller = require('../../controllers/posts.controller');

// @route   POST /api/posts
// @desc    Create post
// @access  Private
router.post(
	'/',
	passport.authenticate('jwt', { session: false }),
	controller.create
);

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public
router.get('/', controller.getAll);

// @route   GET /api/posts/:id
// @desc    Get detail post
// @access  Public
router.get('/:id', controller.getDetail);

// @route   POST /api/posts
// @desc    Create post
// @access  Private
router.post(
	'/favorites/:id',
	passport.authenticate('jwt', { session: false }),
	controller.favorites
);

module.exports = router;
