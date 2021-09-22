const express = require('express');
const router = express.Router();

router.post('/publish', (req, res) => {
    let body = req.body;
    res.json({
        status: "Ok",
        message: body
    });
});

module.exports = router;