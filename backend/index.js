const express = require('express');
const mongoose = require('mongoose');
const urlRoutes = require('./routes/urlRoutes');
const cors = require('cors');

const app = express();
app.use(express.json());


require("dotenv").config();

const dbUser = process.env.MONGODB_USER;
const dbPassword = process.env.MONGODB_PASSWORD;

// Connect to MongoDB
mongoose
    .connect(
        `mongodb+srv://${dbUser}:${dbPassword}@cluster0.re3ha3x.mongodb.net/url-shortener-app`,
        { useNewUrlParser: true, useUnifiedTopology: true } // Add these options for MongoDB connection
    )
    .then(() => {
        console.log("Connected to MongoDB database!");
    })
    .catch((error) => {
        console.error("Connection failed!", error); // Log the error for better debugging
    });

app.use(
    cors({
        origin: "*",
    })
);

app.get('/', (req, res) => {
    res.send('Welcome to URL Shortener API');
});

app.use('/api', urlRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
