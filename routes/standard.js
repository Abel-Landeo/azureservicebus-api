const express = require('express');
const router = express.Router();

const { postPublish, getPeek, getReceive } = require('../controllers/standard');

router.route('/peek').get(getPeek);
router.route('/receive').get(getReceive);
router.route('/publish').post(postPublish);

module.exports = router;