const express = require('express');
const router = express.Router();

const { postPublish } = require('../controllers/standard');

router.route('/publish').post(postPublish);

module.exports = router;