const express = require('express');
const router = express.Router();

const { getEntities, postEntities, putEntities } = require('../controllers/admin');

router.route('/entities')
    .get(getEntities)
    .post(postEntities)
    .put(putEntities);

module.exports = router;