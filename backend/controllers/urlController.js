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

const getUrls = async (req, res) => {
    try{
        const urls = await Url.find({});
        res.json(urls);
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

module.exports = { createShortUrl, redirectUrl, getUrls, deleteUrl };
