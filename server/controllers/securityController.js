const router = require('express').Router();
require('dotenv').config();

router.get('/keys', async (req, res, next) => {
    try {
        const apiKeys = { 
            weatherApiKey: process.env.API_KEY_WEATHER,
        };

        res.status(200).json(apiKeys);
    } catch (error) {
        next(error);
    }
});

module.exports = router;