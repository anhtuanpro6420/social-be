const express = require('express');
const router = express.Router();
const controller = require('../../controllers/users.controller');

router.get('/test', controller.test);

module.exports = router;
