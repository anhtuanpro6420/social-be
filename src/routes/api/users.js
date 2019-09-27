const express = require('express');
const router = express.Router();
const passport = require('passport');
const controller = require('../../controllers/users.controller');

router.get('/test', controller.test);
router.post('/', controller.register);
router.post('/login', controller.login);
router.get('/me', passport.authenticate('jwt', { session: false }), controller.getMyInfo)

module.exports = router;