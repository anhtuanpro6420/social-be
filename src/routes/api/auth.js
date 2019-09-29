const express = require('express');
const router = express.Router();
const passport = require('passport');
const controller = require('../../controllers/auth.controller');

router.post('/login', controller.login);
router.post('/register', controller.register);
router.get(
	'/me',
	passport.authenticate('jwt', { session: false }),
	controller.getMyInfo
);

module.exports = router;
