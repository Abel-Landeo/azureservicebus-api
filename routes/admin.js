const express = require('express');
const router = express.Router();

const { getEntities, postEntities } = require('../controllers/admin');

router.route('/entities')
    .get(getEntities)
    .post(postEntities);

module.exports = router;