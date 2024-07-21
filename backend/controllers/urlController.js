const Url = require('../models/urlModel');

function generateUniqueId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  }

const createShortUrl = async (req, res) => {
    const { originalUrl } = req.body;
    const shortUrl = generateUniqueId(5);
    // check if originalUrl is valid url
    const urlRegex = new RegExp(/^(http|https):\/\/[^ "]+$/);
    if (!urlRegex.test(originalUrl))
        return res.status(400).json('Invalid URL');
    // check if originalUrl already exists in database
    const url = await Url.findOne({
        originalUrl
    });
    if (url) {
        res.json(url);
        return
    }
    // Set expiration date to 7 days from now
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);
    const newUrl = new Url({ originalUrl, shortUrl, expirationDate });
    await newUrl.save();
    res.json(newUrl);
};

const redirectUrl = async (req, res) => {
    const { shortUrl } = req.params;
    const url = await Url.findOne({ shortUrl });

    if (!url || (url.expirationDate && url.expirationDate < new Date())) {
        res.status(404).json('URL expired or not found');
        return;
    }

    url.clicks++;
    await url.save();

    if (url) {
        res.redirect(url.originalUrl);
    } else {
        res.status(404).json('URL not found');
    }
};

const getUrls = async (req, res) => {
    try{
        const urls = await Url.find({}).sort({ _id: -1 });
        res.json(urls);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getDetails = async (req, res) => {
    try {
        const { shortUrl } = req.params;
        const url = await Url.findOne({ shortUrl });
        if (url) {
            res.json(url);
        } else {
            res.status(404).json('URL not found');
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteUrl = async (req, res) => {
    try {
        const { shortUrl } = req.params;
        await Url.findOneAndDelete({ shortUrl });
        res.json('URL deleted');
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { createShortUrl, redirectUrl, getDetails , getUrls, deleteUrl };
