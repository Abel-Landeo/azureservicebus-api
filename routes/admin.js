const express = require('express');
const router = express.Router();

const { 
    getEntities, 
    postEntities, 
    putEntities,
    get 
} = require('../controllers/admin');

router.route('/entities')
    .get(getEntities)
    .post(postEntities)
    .put(putEntities);

router.route('/')
    .get(get);

module.exports = router;