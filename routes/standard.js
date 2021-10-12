const express = require('express');
const router = express.Router();

const { postPublish, getPeek } = require('../controllers/standard');

router.route('/peek').get(getPeek);
router.route('/publish').post(postPublish);

module.exports = router;