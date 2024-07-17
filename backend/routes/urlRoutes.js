const express = require('express');
const { createShortUrl, redirectUrl } = require('../controllers/urlController');
const router = express.Router();

router.post('/shorten', createShortUrl);
router.get('/:shortUrl', redirectUrl);

module.exports = router;
