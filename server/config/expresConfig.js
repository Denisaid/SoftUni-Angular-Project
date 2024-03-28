const express = require('express');
const corsAdd = require('../middleware/corsAdd');
const userSession = require('../middleware/userSession');

module.exports = (app) => {
    app.use(corsAdd());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(userSession());
}