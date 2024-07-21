const express = require('express');
const { createShortUrl, redirectUrl, getUrls, getDetails, deleteUrl } = require('../controllers/urlController');
const router = express.Router();

router.post('/shorten', createShortUrl);
router.get('/urls', getUrls);
router.get('/:shortUrl', redirectUrl);
router.get('/details/:shortUrl', getDetails);
router.delete('/delete/:shortUrl', deleteUrl);

module.exports = router;
