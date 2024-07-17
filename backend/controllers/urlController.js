const Url = require('../models/urlModel');
const { nanoid } = require('nanoid');

const createShortUrl = async (req, res) => {
    const { originalUrl } = req.body;
    const shortUrl = nanoid(8);
    const newUrl = new Url({ originalUrl, shortUrl });
    await newUrl.save();
    res.json(newUrl);
};

const redirectUrl = async (req, res) => {
    const { shortUrl } = req.params;
    const url = await Url.findOne({ shortUrl });
    if (url) {
        res.redirect(url.originalUrl);
    } else {
        res.status(404).json('URL not found');
    }
};

module.exports = { createShortUrl, redirectUrl };
