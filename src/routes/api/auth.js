const express = require('express');
const router = express.Router();
const passport = require('passport');
const controller = require('../../controllers/auth.controller');

// @route   POST /api/auth/login
// @desc    Login
// @access  Public
router.post('/login', controller.login);

// @route   POST /api/auth/register
// @desc    Register
// @access  Public
router.post('/register', controller.register);

// @route   POST /api/auth/me
// @desc    Get my info
// @access  Private
router.get(
	'/me',
	passport.authenticate('jwt', { session: false }),
	controller.getMyInfo
);

module.exports = router;
