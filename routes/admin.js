const express = require('express');
const router = express.Router();

const { 
    getEntities, 
    postEntities, 
    putEntities,
    deleteEntities,
    get 
} = require('../controllers/admin');

router.route('/entities')
    .get(getEntities)
    .post(postEntities)
    .put(putEntities)
    .delete(deleteEntities);

router.route('/')
    .get(get);

module.exports = router;