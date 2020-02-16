const router = require('express').Router();
var path = require('path');

router.get('/cubs', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/cubs.html'));
});

router.get('/bears', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/bears.html'));
});

module.exports = router;