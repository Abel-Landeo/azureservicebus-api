const express = require('express');
const router = express.Router();

const { getList } = require('../controllers/admin');

router.route('/list').get(getList);

module.exports = router;